# TaxReview AI - Intelligent Income Tax Auditing & Portfolio Management

TaxReview AI is a professional, full-stack MERN (MongoDB, Express, React, Node.js) web application designed for Chartered Accountants (CAs), tax practitioners, and individual taxpayers. It automates client portfolio tracking, securely processes Indian tax documents (such as Form 16, AIS, and Form 26AS) using intelligent AI engines, detects compliance discrepancies, and highlights unclaimed tax-saving optimizations under the Income Tax Act, 1961.

---

## 🚀 Key Features

* **AI-Powered Tax Review**: Automated compliance check evaluating gross salaries, deductions, and tax slab eligibility under the Indian Income Tax Act, 1961.
* **Dual-Core Audit Engine**: Primary extraction queries Google Gemini API (`gemini-2.5-flash`) for structural data extraction, with an automatic offline fallback to a local regex parser if the API is offline.
* **Document Processing & OCR**: Drag-and-drop uploader supporting PDF files under 10MB, using a hybrid OCR engine to extract tabular layout data from scanned files.
* **Print-Optimized PDF Report Generation**: Generates high-fidelity, client-facing PDF reports via PDFKit featuring professional page-breaks, header/footer branding, and compliance risk cards.
* **Client Portfolio Management**: Unified dashboard for CAs and tax professionals to search, add, edit, and delete client files associated with their respective PAN numbers.
* **Data Visualization & Analytics**: Interactive charts using Recharts demonstrating monthly document ingestion volume and audit review metrics.
* **Dark / Light Theme System**: Fully responsive interface supporting seamless dark and light mode transitions.
* **EmailJS Contact Form**: Fully functional developer inquiry form to handle quote requests and feedback securely.
* **SEO Optimization**: Enhanced with unique meta descriptions, heading structures, robots.txt crawler guidelines, and search sitemaps.

---

## 🛠️ Technology Stack

### Frontend (Client SPA)
* **Framework**: React.js (`^18.2.0`) built with Vite (`^5.2.0`)
* **Routing**: React Router Dom (`^6.22.3`)
* **Styling**: Tailwind CSS (`^3.4.1`) & custom CSS
* **Forms**: React Hook Form (`^7.51.2`)
* **Toasts**: React Hot Toast (`^2.4.1`)
* **Data Visualization**: Recharts (`^2.12.3`)
* **Icons**: Lucide React (`^0.368.0`)
* **API Client**: Axios (`^1.6.8`) with global interceptors
* **Contact Integration**: `@emailjs/browser` (`^4.4.1`)

### Backend (Server REST API)
* **Runtime**: Node.js & Express.js (`^4.19.2`)
* **Database**: MongoDB Atlas & Mongoose (`^8.2.1`)
* **AI Orchestrator**: Google Generative AI SDK (`@google/generative-ai` `^0.24.1`)
* **OCR & PDF Helpers**: `pdf-parse` (`^1.1.1`), `pdfjs-dist` (`^6.1.200`), `@napi-rs/canvas` (`^1.0.2`), `jpeg-js` (`^0.4.4`), and `tesseract.js` (`^7.0.0`)
* **PDF Compiler**: `pdfkit` (`^0.19.1`)
* **Security & Auth**: `bcryptjs` (`^2.4.3`) & `jsonwebtoken` (`^9.0.2`)
* **File Upload Handling**: `multer` (`^1.4.5-lts.1`)
* **Environment variables**: `dotenv` (`^16.4.5`)

---

## 📂 Folder Structure

```text
TaxReview-AI/
├── client/                     # Frontend Vite Single Page Application
│   ├── public/                 # Static public assets (manifests, robots, sitemap)
│   ├── src/
│   │   ├── assets/             # Branding icons & global SVGs
│   │   ├── components/         # Reusable layouts (Navbar, Sidebar, Loaders)
│   │   ├── context/            # AuthContext (state, axios interceptors)
│   │   ├── layouts/            # Dashboard page layouts
│   │   ├── pages/              # View screens (Dashboard, Upload, Report View)
│   │   │   └── public/         # Public pages (Home, Guide, Blog, Developer)
│   │   ├── services/           # Axios API Client configuration
│   │   ├── index.css           # Design system tokens and print properties
│   │   ├── App.jsx             # SPA React routes definition
│   │   └── main.jsx            # SPA DOM attachment
│   ├── vercel.json             # Vercel deployment routing rewrites config
│   ├── tailwind.config.js      # Tailwind style themes
│   ├── vite.config.js          # Vite build server proxy settings
│   └── package.json            # Client dependencies and npm scripts
│
└── server/                     # Backend API Server
    ├── config/                 # Mongoose database connections
    ├── controllers/            # REST API Endpoint business logic
    ├── middleware/             # Auth check filters & DB ready checks
    ├── models/                 # Mongoose schemas (User, Client, Doc, Review)
    ├── routes/                 # Express router controllers mapping
    ├── services/               # Gemini AI orchestrator and local fallback
    ├── uploads/                # Local storage for Multer PDF uploads
    ├── server.js               # Express application setup
    ├── verify_backend.js       # Integration test script for offline parsing
    └── package.json            # Server dependencies and npm scripts
```

---

## ⚙️ Environment Configuration

Ensure that environment configurations are set up separately for the frontend and backend. Never commit active `.env` configuration files to version control.

### Client Environment Setup (`client/.env`)
Create a `.env` file in the `client/` folder:
```env
VITE_API_URL=/api
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key_here
```

### Server Environment Setup (`server/.env`)
Create a `.env` file in the `server/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_uri_here
JWT_SECRET=your_jwt_signature_secret_here
GEMINI_API_KEY=your_google_gemini_api_key_here
EMAIL_USER=your_email_address_here
EMAIL_PASS=your_email_app_password_here
```

---

## 🏁 Installation & Local Development

### Prerequisites
* **Node.js**: Version 18 or later is recommended.
* **MongoDB**: A local MongoDB database service running, or an active Atlas Cluster connection link.

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/taxreview-ai.git
cd taxreview-ai
```

### Step 2: Set Up the Backend Server
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file using the variables detailed above.
4. Start the server in development mode:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

### Step 3: Set Up the Frontend Client
1. Open a new terminal in the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create the client `.env` file referencing the backend proxy route.
4. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   The client application will start at `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied).

---

## 📦 Build Instructions

To build the client application for production:
1. Navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Run the build command:
   ```bash
   npm run build
   ```
   This compiles the asset files and outputs them to the `client/dist` directory.

---

## 🚀 Production Deployment

### 1. Vercel Deployment (Frontend React Client)
1. Import your repository into the Vercel Dashboard.
2. Configure the project settings:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `client`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. Add the following Environment Variables in the Vercel Dashboard:
   * `VITE_API_URL`: The URL of your deployed backend service (e.g. `https://api.taxreviewai.com`).
   * `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`.
4. Vercel automatically uses the `vercel.json` rewrite file to ensure React Router client-side routes do not return 404 errors on refresh.

### 2. Render Deployment (Backend Node API)
1. Import your repository into Render.
2. Select **New Web Service**.
3. Configure the build and start options:
   * **Root Directory**: `server`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
4. Add the required Environment Variables in the Render dashboard:
   * `PORT`: `10000` (or leave default for Render auto-assignment).
   * `MONGO_URI`: Your MongoDB Atlas connection string.
   * `JWT_SECRET`: A secure signature key.
   * `GEMINI_API_KEY`: Your Gemini API access key.
5. In Render's **Advanced settings**, set the Node Version under Environment variables: `NODE_VERSION` = `18.0.0` or higher.

---

## 📷 Screenshots
*(Place screenshots demonstrating the main UI features here)*
- **Home Page**: Modern and clean public portal.
- **Dashboard**: CA interface with search, client management, analytics, and status flags.
- **Upload Page**: Secure drag-and-drop zone with document validation.
- **AI Review**: Executive summary displaying risk score, compliance alerts, and optimization metrics.
- **PDF Report**: High-fidelity, printable PDF audit document.
- **Developer Page**: Professional developer portfolio containing contact and quote submission forms.

---

## 🛠️ Troubleshooting & FAQs

**Q: Why does the PDF extraction print a canvas error?**
* **A**: The server polyfills standard HTML5 canvas rendering in a headless environment. Ensure that node dependencies are compiled correctly. Run `npm rebuild` in the server folder if system binaries mismatch.

**Q: Can I run the audit engine if the Gemini API key is missing?**
* **A**: Yes. The system automatically detects missing or failing API keys and triggers a local regex-based audit engine. The parsing remains fully functional, generating accurate compliance numbers offline.

---

## 🤝 Contributing Guidelines

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 🌐 Live Demo

Frontend: Coming Soon

Backend API: Coming Soon

These are placeholders and will be updated after deployment.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

Developed by **Darshil Doshi** as a Full-Stack MERN project.

[GitHub](https://github.com/darshiltdoshi) | [LinkedIn](https://www.linkedin.com/in/darshiltdoshi)
