import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import path from 'path';

const app = express();

const upload = multer({
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC HTML
========================= */

app.use(express.static('public'));

/* =========================
   ERROR DEBUG
========================= */

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION');
  console.error(err);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION');
  console.error(err);
});

/* =========================
   GEMINI CONFIG
========================= */

if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY BELUM ADA');
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const GEMINI_MODEL = 'gemini-2.5-flash';

/* =========================
   ROOT
========================= */

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

/* =========================
   HEALTH CHECK
========================= */

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok'
  });
});

/* =========================
   TEXT
========================= */

app.post('/generate-text', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Prompt wajib diisi'
      });
    }

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt
    });

    res.status(200).json({
      success: true,
      result: response.text
    });

  } catch (e) {
    console.error(e);

    res.status(500).json({
      success: false,
      message: e.message
    });
  }
});

/* =========================
   IMAGE
========================= */

app.post('/generate-from-image', upload.single('image'), async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File gambar wajib diupload'
      });
    }

    const base64Image = req.file.buffer.toString('base64');

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          text: prompt || 'Jelaskan isi gambar berikut.'
        },
        {
          inlineData: {
            data: base64Image,
            mimeType: req.file.mimetype
          }
        }
      ]
    });

    res.status(200).json({
      success: true,
      result: response.text
    });

  } catch (e) {
    console.error(e);

    res.status(500).json({
      success: false,
      message: e.message
    });
  }
});

/* =========================
   DOCUMENT
========================= */

app.post('/generate-from-document', upload.single('document'), async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File dokumen wajib diupload'
      });
    }

    const base64Document = req.file.buffer.toString('base64');

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          text: prompt || 'Ringkas dokumen berikut.'
        },
        {
          inlineData: {
            data: base64Document,
            mimeType: req.file.mimetype
          }
        }
      ]
    });

    res.status(200).json({
      success: true,
      result: response.text
    });

  } catch (e) {
    console.error(e);

    res.status(500).json({
      success: false,
      message: e.message
    });
  }
});

/* =========================
   AUDIO
========================= */

app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File audio wajib diupload'
      });
    }

    const base64Audio = req.file.buffer.toString('base64');

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          text: prompt || 'Buat transkrip audio berikut.'
        },
        {
          inlineData: {
            data: base64Audio,
            mimeType: req.file.mimetype
          }
        }
      ]
    });

    res.status(200).json({
      success: true,
      result: response.text
    });

  } catch (e) {
    console.error(e);

    res.status(500).json({
      success: false,
      message: e.message
    });
  }
});

/* =========================
   404
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server ready on http://localhost:${PORT}`);
});