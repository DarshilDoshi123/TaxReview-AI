import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import SEO from '../../components/SEO';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ArrowRight, 
  Check, 
  Cpu, 
  Layers, 
  Globe, 
  FileText, 
  Layout, 
  Settings, 
  Database, 
  Sparkles, 
  Code, 
  Terminal, 
  Briefcase, 
  Clock, 
  Shield, 
  Workflow, 
  User, 
  CheckCircle,
  Monitor,
  Lightbulb,
  Rocket
} from 'lucide-react';

const Developer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Full Stack Web Development',
    budget: '',
    timeline: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      tempErrors.email = 'Enter a valid email address';
    }
    if (!formData.description.trim()) tempErrors.description = 'Project description is required';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');

    // Fetch EmailJS keys from environment variables configured in client/.env
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Developer note check: If configuration environment variables are missing, fallback cleanly to simulation mode.
    if (!serviceId || !templateId || !publicKey || serviceId.includes('your_emailjs') || templateId.includes('your_emailjs')) {
      console.warn('EmailJS environment variables are not configured in client/.env. Falling back to simulation mode.');
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: 'Full Stack Web Development',
          budget: '',
          timeline: '',
          description: ''
        });
      }, 1500);
      return;
    }

    // Map form fields to template params for EmailJS (covering snake_case, camelCase, and custom key conventions)
    const templateParams = {
      from_name: formData.name,
      fromName: formData.name,
      name: formData.name,
      fullName: formData.name,
      full_name: formData.name,
      from_email: formData.email,
      fromEmail: formData.email,
      email: formData.email,
      phone: formData.phone || 'N/A',
      company: formData.company || 'N/A',
      service: formData.service,
      budget: formData.budget || 'N/A',
      timeline: formData.timeline || 'N/A',
      message: formData.description,
      description: formData.description,
      project_description: formData.description,
      projectDescription: formData.description
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: 'Full Stack Web Development',
          budget: '',
          timeline: '',
          description: ''
        });
      })
      .catch((error) => {
        console.error('EmailJS request failed:', error);
        setIsSubmitting(false);
        setSubmitError('Failed to send project inquiry. Please verify your connection details or try again later.');
      });
  };

  const scrollToQuote = () => {
    const element = document.getElementById('quote-form-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Structured Data Schema for search engines
  const developerSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Darshil Doshi",
    "jobTitle": "Full Stack Developer",
    "description": "Portfolio of Darshil Doshi, a Full Stack Developer specializing in MERN Stack, responsive web applications, modern UI/UX, and AI-powered web solutions.",
    "url": window.location.origin,
    "sameAs": [
      "https://github.com/DarshilDoshi123",
      "https://linkedin.com/in/darshildoshi-placeholder"
    ]
  };

  return (
    <>
      <SEO 
        title="Darshil Doshi | Full Stack Developer" 
        description="Portfolio of Darshil Doshi, a Full Stack Developer specializing in MERN Stack, responsive web applications, modern UI/UX, and AI-powered web solutions."
        schema={developerSchema}
      />

      {/* ====================================================
          SECTION 1 — HERO
          ==================================================== */}
      <section className="relative py-20 md:py-28 overflow-hidden border-b border-slate-200/50 dark:border-slate-900/50">
        <div className="absolute top-[10%] left-[5%] -z-10 h-[450px] w-[450px] rounded-full bg-primary-500/5 blur-[120px] dark:bg-primary-500/10" />
        <div className="absolute bottom-[10%] right-[5%] -z-10 h-[450px] w-[450px] rounded-full bg-indigo-500/5 blur-[120px] dark:bg-indigo-500/10" />

        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="text-[10px] font-bold text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-950/40 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                Available for Contract & Freelance Projects
              </span>
              <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-slate-900 dark:text-white leading-tight">
                Darshil Doshi <br />
                <span className="bg-gradient-to-r from-primary-500 to-indigo-500 bg-clip-text text-transparent block mt-1">
                  Full Stack Developer
                </span>
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-500 dark:text-slate-400 block mt-2.5 tracking-wide">
                  MERN Stack • AI Integration • Prompt Engineering
                </span>
              </h1>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl text-left lg:text-justify lg:mx-0 leading-[1.75] font-medium mb-6">
                I build modern, responsive, SEO-friendly, and AI-powered web applications using the MERN Stack. My focus is on creating scalable, high-performance applications with clean UI/UX, efficient backend architecture, and intelligent AI integrations that solve real-world business problems.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-4">
                <button
                  onClick={scrollToQuote}
                  className="bg-gradient-to-r from-primary-500 to-indigo-500 text-white rounded-xl px-5 py-3 text-xs font-bold shadow-lg shadow-primary-500/20 hover:opacity-95 transition-all duration-200"
                >
                  Request a Quote
                </button>
                <a
                  href="mailto:darshiltdoshi1@gmail.com"
                  className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 rounded-xl px-5 py-3 text-xs font-bold transition-all duration-200 inline-flex items-center gap-1.5"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email Me</span>
                </a>
                <a
                  href="https://github.com/DarshilDoshi123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 rounded-xl px-5 py-3 text-xs font-bold transition-all duration-200 inline-flex items-center gap-1.5"
                >
                  <Github className="h-4 w-4" />
                  <span>View GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/darshildoshi-placeholder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 rounded-xl px-5 py-3 text-xs font-bold transition-all duration-200 inline-flex items-center gap-1.5"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>View LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Hero Right: Avatar/Geometric Graphic Illustration */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative h-[360px] w-72 sm:w-80 rounded-[2rem] border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xl hover:shadow-2xl hover:shadow-primary-500/5 hover:border-primary-500/20 p-8 flex items-center justify-center overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group select-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 to-indigo-500/5 opacity-100 group-hover:from-primary-500/10 group-hover:to-indigo-500/10 transition-all duration-300" />
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary-500/10 blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
                
                {/* Styled CSS/SVG Tech Avatar */}
                <div className="relative space-y-4 text-center z-10 w-full">
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-600 p-0.5 shadow-md shadow-primary-500/10 group-hover:shadow-primary-500/20 group-hover:scale-105 transition-all duration-300 relative">
                    <div className="absolute inset-0 bg-primary-500/20 blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-300 rounded-2xl" />
                    <div className="relative h-full w-full rounded-2xl bg-white dark:bg-slate-950 flex items-center justify-center text-primary-500 dark:text-primary-400">
                      <Terminal className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-primary-500 dark:group-hover:text-primary-400">
                      Darshil Doshi
                    </h3>
                    <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block">
                      Full Stack Developer
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      MERN Stack • AI Integration
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1.5">
                    {[
                      'React',
                      'Node.js',
                      'Express',
                      'MongoDB',
                      'REST APIs',
                      'AI Integration',
                      'Prompt Engineering',
                      'GitHub'
                    ].map((t) => (
                      <span key={t} className="rounded-full border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 px-2 py-0.5 text-[8px] font-extrabold text-slate-500 dark:text-slate-400 hover:border-primary-500/30 hover:bg-white dark:hover:bg-slate-900 hover:text-primary-500 dark:hover:text-primary-400 transition-all duration-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION 2 — ABOUT ME & EXPERTISE
          ==================================================== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 text-center md:text-left">
              <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block mb-2">Introduction</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">About Me</h2>
            </div>
            <div className="md:col-span-8 space-y-5 text-sm md:text-base leading-relaxed text-slate-500 dark:text-slate-400">
              <p className="text-left lg:text-justify">
                I am a professional <strong>Full Stack Developer</strong> dedicated to engineering modern, responsive, and scalable web applications. I specialize in building end-to-end web products that combine intuitive UI/UX experiences with reliable backend architectures and AI-driven automation.
              </p>
            </div>
          </div>

          {/* Expertise Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                title: 'Full Stack Development',
                skills: ['MERN Stack', 'REST APIs', 'Authentication', 'Responsive Design']
              },
              {
                icon: Cpu,
                title: 'AI & Automation',
                skills: ['AI Integration', 'Prompt Engineering', 'LLM Applications', 'Workflow Automation']
              },
              {
                icon: Sparkles,
                title: 'Performance',
                skills: ['SEO Optimization', 'Accessibility', 'Performance Optimization', 'Clean UI/UX']
              }
            ].map((exp, idx) => {
              const Icon = exp.icon;
              return (
                <div 
                  key={idx} 
                  className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900/60 p-6 rounded-2xl shadow-sm hover:border-primary-500/20 hover:-translate-y-1 transition-all duration-300 flex flex-col space-y-4"
                >
                  <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 w-fit">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight uppercase tracking-wider">{exp.title}</h3>
                    <ul className="space-y-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      {exp.skills.map((skill) => (
                        <li key={skill} className="flex items-center space-x-2">
                          <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION 3 — SERVICES
          ==================================================== */}
      <section className="py-16 md:py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-950/20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Capabilities</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Services Offered</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
              Discover tailormade development services optimized for performance, security, and responsive layouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Terminal, title: 'Full Stack Web Applications', desc: 'Custom, end-to-end web applications built from scratch with clean, modular MERN codebases.' },
              { icon: Layout, title: 'Business Websites', desc: 'Premium, conversion-oriented profiles built to highlight services, values, and client testimonials.' },
              { icon: Layers, title: 'Admin Dashboards', desc: 'Interactive administrative portals for charts, tables, secure records, and backend configuration.' },
              { icon: Cpu, title: 'AI-Powered Applications', desc: 'Integrating intelligent features, prompt processing loops, and modern AI API models.' },
              { icon: Database, title: 'MERN Stack Development', desc: 'Engineered using MongoDB Atlas, Express, React, and Node.js for scalable backend processing.' },
              { icon: Monitor, title: 'UI/UX Improvements', desc: 'Refining legacy pages into beautiful web interfaces with pixel-perfect responsive templates.' },
              { icon: Workflow, title: 'API Development & Integration', desc: 'Designing secure, reliable REST API endpoints and integrating external APIs smoothly.' },
              { icon: Globe, title: 'SEO Optimization', desc: 'Implementing technical SEO best practices, structured schemas, meta tags, and high scores.' },
              { icon: Clock, title: 'Performance Optimization', desc: 'Improving site speed, image compression, database query execution, and core web vital parameters.' },
              { icon: Settings, title: 'Website Maintenance', desc: 'Regular security audits, version updates, bug fixing support, and styling adjustments.' }
            ].map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div 
                  key={idx} 
                  className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="p-3 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 w-fit flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{srv.title}</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">{srv.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION 4 — TECHNOLOGIES
          ==================================================== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Stack</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Technology Stack</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-xs leading-relaxed">
              Modern tools and frameworks I use to engineer scalable, high-performance web products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category: Frontend */}
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm space-y-4">
              <span className="text-[9px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider block border-b border-slate-100 dark:border-slate-800 pb-2">Frontend</span>
              <div className="flex flex-wrap gap-2">
                {['React', 'JavaScript', 'HTML5', 'CSS3'].map((t) => (
                  <span key={t} className="bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-950 dark:border-slate-850 dark:text-slate-300 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wide">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Category: Backend */}
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm space-y-4">
              <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block border-b border-slate-100 dark:border-slate-800 pb-2">Backend & Database</span>
              <div className="flex flex-wrap gap-2">
                {['Node.js', 'Express.js', 'MongoDB', 'REST APIs'].map((t) => (
                  <span key={t} className="bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-950 dark:border-slate-850 dark:text-slate-300 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wide">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Category: AI */}
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm space-y-4">
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block border-b border-slate-100 dark:border-slate-800 pb-2">AI & Intelligence</span>
              <div className="flex flex-wrap gap-2">
                {['Prompt Engineering', 'AI Integration', 'Gemini API', 'OpenAI API Ready'].map((t) => (
                  <span key={t} className="bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-950 dark:border-slate-850 dark:text-slate-300 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wide">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Category: Development */}
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm space-y-4">
              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block border-b border-slate-100 dark:border-slate-800 pb-2">Development & SEO</span>
              <div className="flex flex-wrap gap-2">
                {['Git', 'GitHub', 'Responsive Design', 'SEO Optimization'].map((t) => (
                  <span key={t} className="bg-slate-50 border border-slate-200 text-slate-700 dark:bg-slate-950 dark:border-slate-850 dark:text-slate-300 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wide">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Technology Flexibility Callout */}
          <div className="mt-10 max-w-2xl mx-auto border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left backdrop-blur-sm hover:border-primary-500/20 transition-all duration-300">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 h-fit flex-shrink-0">
              <Lightbulb className="h-5 w-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Always Learning</h4>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                Technology evolves quickly, and I enjoy continuously learning new frameworks, libraries, and tools. If your preferred technology isn't listed, feel free to discuss your project. If it's technically feasible, I'll evaluate the requirements and adopt the most suitable technology to deliver a reliable solution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION 5 — DEVELOPMENT PROCESS
          ==================================================== */}
      <section className="py-16 md:py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-950/20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Workflow</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Development Process</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6 relative">
            <div className="absolute top-[35px] left-[40px] right-[40px] h-0.5 bg-slate-100 dark:bg-slate-850 hidden lg:block z-0" />
            
            {[
              { step: '01', title: 'Requirement Discussion', desc: 'Align on project vision, specifications, timelines, and budgets.' },
              { step: '02', title: 'Planning', desc: 'Establish codebase architectures, database schemas, and workflows.' },
              { step: '03', title: 'UI/UX Design', desc: 'Craft clean layout plans, typography definitions, and component styling.' },
              { step: '04', title: 'Development', desc: 'Program the modular React layouts and construct backend endpoint routers.' },
              { step: '05', title: 'Testing', desc: 'Test logic operations, form verifications, and route security rules.' },
              { step: '06', title: 'Deployment', desc: 'Configure cloud hosting platforms and launch live product builds.' },
              { step: '07', title: 'Support', desc: 'Deliver ongoing maintenance and subsequent technical modifications.' }
            ].map((prc, idx) => (
              <div key={idx} className="space-y-4 relative z-10 text-center lg:text-left">
                <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-xs font-extrabold text-primary-600 dark:bg-slate-900 dark:border-slate-800 dark:text-primary-400 mx-auto lg:mx-0">
                  {prc.step}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{prc.title}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[140px] mx-auto lg:mx-0 font-semibold">
                  {prc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION 6 — FEATURED PROJECT
          ==================================================== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Portfolio Project</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Featured Full Stack Project</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
              TaxReview AI – The application you are browsing is a custom product built from the ground up to showcase development skills.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Project Specs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">TaxReview AI</h3>
                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded uppercase">Full Stack Application</span>
              </div>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                An intelligent Income Tax Review portal built to parse complex tax documents and run compliance rule verification. It showcases a modern React frontend dashboard coupled with a robust Node.js audit engine.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'MERN Stack', desc: 'Structured utilizing React views, Node.js server pipelines, Express routes, and MongoDB schemas.' },
                  { title: 'OCR Document Processing', desc: 'Layout-aware extraction checks tabular figures inside statements.' },
                  { title: 'AI-Powered Review', desc: 'Reconciles extracted data with default income tax regulations.' },
                  { title: 'PDF Report Generation', desc: 'Generates print-ready compliance audit sheets on demand.' },
                  { title: 'SEO Optimized Website', desc: 'Utilizes metadata headers, structured schema cards, and index tags.' },
                  { title: 'Responsive Dashboard', desc: 'Interactive real-time client detail layouts with light and dark mode.' }
                ].map((feat, idx) => (
                  <div key={idx} className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feat.title}</span>
                    </h4>
                    <p className="text-[10px] text-slate-450 pl-5.5 leading-relaxed font-semibold">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Showcase Graphic */}
            <div className="lg:col-span-6">
              <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 to-indigo-500/5 pointer-events-none" />
                
                {/* CSS Mockup of Dashboard Interface */}
                <div className="space-y-4">
                  {/* Mock Navbar */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded">
                      taxreview-ai-dashboard
                    </div>
                  </div>
                  {/* Mock Content Layout */}
                  <div className="space-y-3 font-mono text-[9px]">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-slate-600 dark:text-slate-300">Form-16-Salaried.pdf</span>
                      </div>
                      <span className="text-green-500 font-bold bg-green-500/10 px-1.5 py-0.5 rounded text-[8px]">COMPLETED</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg space-y-2 border border-slate-100 dark:border-slate-850">
                      <div className="text-slate-500 uppercase text-[8px] font-bold">Audit Results Summary:</div>
                      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 pb-1 text-slate-600 dark:text-slate-300">
                        <span>Gross Salary:</span>
                        <span>Rs. 14,50,000</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 pb-1 text-slate-600 dark:text-slate-300">
                        <span>Claimed Sec 80C:</span>
                        <span>Rs. 1,50,000</span>
                      </div>
                      <div className="flex items-center justify-between text-amber-500">
                        <span>Anomalies Flagged:</span>
                        <span>2 Warnings</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION 6.5 — AI DEVELOPMENT HIGHLIGHT
          ==================================================== */}
      <section className="py-16 md:py-24 border-t border-slate-100 dark:border-slate-900">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2 space-y-4 text-center lg:text-left">
              <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Innovation</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">AI-Powered Development</h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                I leverage modern AI technologies to build intelligent web applications that automate tasks, improve user experiences, assist with content generation, and streamline business workflows through effective AI integration and prompt engineering.
              </p>
            </div>
            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {[
                'AI Chat Integration',
                'Prompt Engineering',
                'Workflow Automation',
                'Smart Content Generation',
                'AI API Integration'
              ].map((badge, idx) => (
                <div 
                  key={idx} 
                  className="border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/40 p-4 rounded-2xl flex items-center space-x-3 shadow-xs hover:border-primary-500/20 transition-all duration-300"
                >
                  <div className="h-6 w-6 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    ✓
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION 7 — WORK WITH ME (PROMO)
          ==================================================== */}
      <section className="py-16 md:py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-950/20">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Collaborate</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Let's Build Your Next Project</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed font-semibold">
              Need a modern website, business website, portfolio, admin dashboard, or full stack web application? Let's discuss your idea, understand your requirements, estimate the project scope, timeline, and pricing, and build something amazing together.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              'Business Website',
              'Company Website',
              'Portfolio Website',
              'MERN Stack Application',
              'Admin Dashboard',
              'AI Web App',
              'Custom Web Application'
            ].map((projName, idx) => (
              <div 
                key={idx} 
                className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 rounded-xl text-center shadow-sm hover:scale-102 hover:border-primary-500/20 transition-all duration-300"
              >
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{projName}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION 8 — REQUEST A QUOTE FORM
          ==================================================== */}
      <section id="quote-form-section" className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <div className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-lg space-y-8">
            <div className="text-center space-y-2.5">
              <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Get a Project Estimate</span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Request a Quote</h2>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                Tell me about your website or application requirements. I'll get back to you with timelines and pricing estimates.
              </p>
            </div>

            {submitted ? (
              <div className="text-center space-y-4 py-8 animate-fade-in">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quote Request Sent!</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-semibold">
                    Thank you! Your project inquiry has been sent successfully. I'll get back to you as soon as possible.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-primary-500 font-bold hover:underline"
                >
                  Submit Another Project Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border ${errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20'} bg-transparent px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-4`}
                      placeholder="Jane Doe"
                    />
                    {errors.name && <p className="text-[9px] font-bold text-red-500">{errors.name}</p>}
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20'} bg-transparent px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-4`}
                      placeholder="jane@company.com"
                    />
                    {errors.email && <p className="text-[9px] font-bold text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone / WhatsApp (Optional)</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/20"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  {/* Company field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company (Optional)</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/20"
                      placeholder="Acme Corporation"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Service type dropdown */}
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Required</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/20"
                    >
                      <option>Full Stack Web Development</option>
                      <option>Business Website</option>
                      <option>Company Website</option>
                      <option>Portfolio Website</option>
                      <option>Landing Pages</option>
                      <option>Admin Dashboard</option>
                      <option>MERN Stack Application</option>
                      <option>Custom Web Application</option>
                    </select>
                  </div>

                  {/* Budget field */}
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Budget (Optional)</label>
                    <input
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/20"
                      placeholder="e.g. ₹50,000"
                    />
                  </div>

                  {/* Timeline field */}
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Preferred Timeline (Optional)</label>
                    <input
                      type="text"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/20"
                      placeholder="e.g. 4 Weeks"
                    />
                  </div>
                </div>

                {/* Description textarea */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Project Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`block w-full rounded-xl border ${errors.description ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20'} bg-transparent px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-4`}
                    placeholder="Briefly describe your project requirements, goals, and key features..."
                  />
                  {errors.description && <p className="text-[9px] font-bold text-red-500">{errors.description}</p>}
                </div>
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold text-center space-y-2">
                    <p>{submitError}</p>
                    <button
                      type="button"
                      onClick={() => setSubmitError('')}
                      className="underline hover:text-red-650 dark:hover:text-red-400 block mx-auto text-[10px]"
                    >
                      Dismiss & Try Again
                    </button>
                  </div>
                )}

                {/* Submit button */}
                <div className="space-y-3.5 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary-500 to-indigo-500 hover:opacity-95 text-white rounded-xl py-3.5 text-xs font-bold transition-all shadow-md shadow-primary-500/15 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Submitting Details...' : 'Request a Quote'}</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center leading-relaxed font-semibold italic">
                    Every project is different. After receiving your request, we'll discuss your requirements, recommend the best technical approach, define the project scope, timeline, and pricing before starting development.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION 9 — CONNECT
          ==================================================== */}
      <section className="py-16 md:py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-950/20">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Channels</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Connect With Me</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Github, label: 'GitHub', username: 'DarshilDoshi123', link: 'https://github.com/DarshilDoshi123' },
              { icon: Linkedin, label: 'LinkedIn', username: 'Darshil Doshi', link: 'https://linkedin.com/in/darshildoshi-placeholder' },
              { icon: Mail, label: 'Email', username: 'darshiltdoshi1@gmail.com', link: 'mailto:darshiltdoshi1@gmail.com' }
            ].map((ch, idx) => {
              const Icon = ch.icon;
              return (
                <a 
                  key={idx}
                  href={ch.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm hover:border-primary-500/30 transition-all duration-300 flex items-center space-x-4 animate-fade-in"
                >
                  <div className="p-3 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{ch.label}</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 break-all">{ch.username}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Developer;
