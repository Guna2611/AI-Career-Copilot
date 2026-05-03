import ResumeAnalyzerForm from "../components/ResumeAnalyzerForm";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xl">
            J
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">JobFit AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it works</a>
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
          <a href="#analyze" className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors">
            Try Demo
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 sm:pt-24 lg:pt-32 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6 lg:text-left text-center">
            <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
              AI-Powered Resume Review
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              Optimize your resume for the <span className="text-indigo-600">perfect job match.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0">
              Instantly compare your resume against target job descriptions. Uncover missing skills, get actionable improvement suggestions, and practice tailored interview questions to land your next role.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#analyze" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">
                Analyze Resume Now
              </a>
              <a href="#how-it-works" className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-900 hover:bg-slate-50 transition-all">
                See How It Works
              </a>
            </div>
          </div>
          
          <div className="mt-16 lg:col-span-6 lg:mt-0 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl -z-10 blur-2xl opacity-70"></div>
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 overflow-hidden">
              <div className="border-b border-slate-100 pb-4 mb-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-400"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">Analysis Results</div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full border-4 border-emerald-500 flex items-center justify-center">
                  <span className="text-xl font-bold text-emerald-600">85</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Excellent fit</h3>
                  <p className="text-sm text-slate-500">Strong match for Senior Frontend Developer</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-md border border-emerald-200">React</span>
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-md border border-emerald-200">TypeScript</span>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-rose-50 text-rose-700 text-xs rounded-md border border-rose-200">GraphQL (Missing)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How JobFit AI works</h2>
          <p className="mt-4 text-lg text-slate-600">Get a professional resume review in three simple steps.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 font-bold text-xl mb-6">1</div>
            <h3 className="text-lg font-bold text-slate-900">Upload your Resume</h3>
            <p className="mt-2 text-slate-600">Upload your current PDF resume. We securely parse your experience, skills, and background.</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 font-bold text-xl mb-6">2</div>
            <h3 className="text-lg font-bold text-slate-900">Paste Job Description</h3>
            <p className="mt-2 text-slate-600">Provide the description of the role you want. Our AI analyzes the core requirements.</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 font-bold text-xl mb-6">3</div>
            <h3 className="text-lg font-bold text-slate-900">Get Actionable Insights</h3>
            <p className="mt-2 text-slate-600">Receive a detailed match score, spot missing skills, and get tailored interview questions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}


function Features() {
  const features = [
    {
      title: "Smart AI Scoring",
      description: "Go beyond simple keyword matching. Our AI analyzes the semantic context of your experience to generate an accurate, recruiter-grade match score.",
      icon: "🎯",
    },
    {
      title: "Instant Skill Gap Analysis",
      description: "Instantly identify exactly what required skills, tools, or seniority markers are missing from your resume so you can bridge the gap.",
      icon: "🔍",
    },
    {
      title: "Actionable Resume Improvements",
      description: "Receive tailored, line-by-line suggestions on how to rephrase your bullet points to better align with the target role's expectations.",
      icon: "💡",
    },
    {
      title: "Targeted Interview Practice",
      description: "Anticipate the recruiter's questions. We generate custom interview questions specifically targeting the weak spots and gaps found in your resume.",
      icon: "🎤",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything you need to land the interview</h2>
          <p className="mt-4 text-lg text-slate-600">Our comprehensive analysis tools give you an unfair advantage in the job market.</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-6 rounded-2xl border border-slate-100 bg-slate-50 p-8 hover:bg-indigo-50/30 hover:border-indigo-100 transition-colors">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm text-2xl">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        
        <section id="analyze" className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Analyze Your Resume</h2>
              <p className="mt-4 text-lg text-slate-600">Upload your details below to get a recruiter-grade analysis instantly.</p>
            </div>
            
            <ResumeAnalyzerForm />
          </div>
        </section>
      </main>
      
      <footer className="bg-slate-900 py-12 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-slate-400">© 2026 JobFit AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
