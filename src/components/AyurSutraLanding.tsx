import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Eye, EyeOff, Sparkles, Award, Shield, Zap } from 'lucide-react';
import AyurSutraLogo from './AyurSutraLogo';

// Icons component for consistent styling
const Icon = ({ name, className = "" }: { name: string, className?: string }) => {
  const iconMap: { [key: string]: string } = {
    calendar: "📅",
    bell: "🔔", 
    chart: "📊",
    alert: "⚠️",
    phone: "📞",
    user: "👤",
    clock: "⏰",
    heart: "💚",
    star: "⭐",
    checkmark: "✓",
    menu: "☰",
    close: "✕"
  };
  
  return <span className={`text-2xl ${className}`}>{iconMap[name] || "📍"}</span>;
};

const AyurSutraLanding = () => {
  const { user, signIn, signUp, signOut } = useAuth();
  const { toast } = useToast();
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ 
    name: '', 
    clinicName: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(loginForm.email, loginForm.password);
    
    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in."
      });
      setIsLoginOpen(false);
      setLoginForm({ email: '', password: '' });
    }
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (signupForm.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp(
      signupForm.email, 
      signupForm.password, 
      signupForm.name, 
      signupForm.clinicName
    );
    
    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account."
      });
      setIsSignupOpen(false);
      setSignupForm({ name: '', clinicName: '', email: '', password: '', confirmPassword: '' });
    }
    setIsSubmitting(false);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out."
      });
    }
  };

  const switchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const switchToLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-md shadow-soft z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <AyurSutraLogo size="md" variant="nav" />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button onClick={() => scrollToSection('hero')} className="text-foreground hover:text-primary transition-smooth">
                  Home
                </button>
                <button onClick={() => scrollToSection('features')} className="text-foreground hover:text-primary transition-smooth">
                  Features
                </button>
                <button onClick={() => scrollToSection('how-it-works')} className="text-foreground hover:text-primary transition-smooth">
                  How It Works
                </button>
                <button onClick={() => scrollToSection('testimonials')} className="text-foreground hover:text-primary transition-smooth">
                  Testimonials
                </button>
                {!user ? (
                  <button onClick={() => setIsLoginOpen(true)} className="text-foreground hover:text-primary transition-smooth">
                    Login
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Welcome, {user.email}
                    </span>
                    <button onClick={handleSignOut} className="text-foreground hover:text-primary transition-smooth">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden md:block">
              {!user ? (
                <Button onClick={() => setIsDemoOpen(true)} variant="secondary" className="btn-secondary">
                  Request Demo
                </Button>
              ) : (
                <Button onClick={() => setIsDemoOpen(true)} className="btn-primary">
                  Access Dashboard
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-foreground hover:text-primary focus:outline-none focus:text-primary"
              >
                <Icon name={isMobileMenuOpen ? "close" : "menu"} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background/98 backdrop-blur-md border-b border-border">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={() => scrollToSection('hero')} className="block w-full text-left px-3 py-2 text-foreground hover:text-primary">
                Home
              </button>
              <button onClick={() => scrollToSection('features')} className="block w-full text-left px-3 py-2 text-foreground hover:text-primary">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left px-3 py-2 text-foreground hover:text-primary">
                How It Works
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left px-3 py-2 text-foreground hover:text-primary">
                Testimonials
              </button>
              {!user ? (
                <button onClick={() => setIsLoginOpen(true)} className="block w-full text-left px-3 py-2 text-foreground hover:text-primary">
                  Login
                </button>
              ) : (
                <div className="px-3 py-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Welcome, {user.email}
                  </p>
                  <button onClick={handleSignOut} className="text-foreground hover:text-primary">
                    Sign Out
                  </button>
                </div>
              )}
              <div className="px-3 py-2">
                {!user ? (
                  <Button onClick={() => setIsDemoOpen(true)} variant="secondary" className="btn-secondary w-full">
                    Request Demo
                  </Button>
                ) : (
                  <Button onClick={() => setIsDemoOpen(true)} className="btn-primary w-full">
                    Access Dashboard
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Premium Design */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-16 overflow-hidden">
        {/* Premium Background with Authentic Ayurvedic Clinic */}
        <div 
          className="absolute inset-0 z-0 transform scale-110 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at center top, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%), 
              linear-gradient(135deg, rgba(16, 78, 56, 0.3) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(16, 78, 56, 0.4) 100%), 
              url('/src/assets/hero-spa.jpg')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        />
        
        {/* Animated Particles/Glow Effects */}
        <div className="absolute inset-0 z-5 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-ayur-gold rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-ayur-sage rounded-full filter blur-3xl opacity-25 animate-pulse delay-500"></div>
        </div>
        
        {/* Premium Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto">

          

          
          {/* Hero Title with Advanced Typography */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in-up delay-200">
            <span className="block text-white drop-shadow-2xl">Empower Your</span>
            <span className="block bg-gradient-to-r from-ayur-gold via-ayur-saffron to-ayur-gold bg-clip-text text-transparent animate-gradient-x drop-shadow-2xl">
              Panchakarma Practice
            </span>
          </h1>
          
          {/* Premium Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed font-light animate-fade-in-up delay-400">
            The complete practitioner portal for <span className="font-medium text-ayur-gold">Panchakarma clinic management</span> - 
            streamline patient care, automate workflows, and elevate your Ayurvedic practice.
          </p>
          
          {/* Premium CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-600">
            <Button 
              onClick={() => setIsDemoOpen(true)} 
              size="lg" 
              className="group relative overflow-hidden bg-gradient-to-r from-ayur-gold to-ayur-saffron hover:from-ayur-saffron hover:to-ayur-gold text-white font-bold text-lg px-12 py-6 rounded-2xl shadow-2xl hover:shadow-ayur-gold/30 transition-all duration-500 transform hover:scale-105 border-2 border-ayur-gold/30"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                <span>Start Free Trial</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="group bg-white/10 backdrop-blur-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 text-white hover:text-white text-lg px-10 py-6 rounded-2xl shadow-xl transition-all duration-500 transform hover:scale-105"
            >
              <span className="flex items-center gap-3">
                <span className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <Zap className="w-6 h-6" />
                </span>
                <span>Watch Demo</span>
              </span>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 animate-fade-in-up delay-800">
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-ayur-gold" />
                <span className="text-sm font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-ayur-gold" />
                <span className="text-sm font-medium">Trusted by 500+ Clinics</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-ayur-gold" />
                <span className="text-sm font-medium">99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Problem Section - Premium Redesign */}
      <section id="problem" className="section-padding bg-gradient-to-br from-gray-50 via-white to-ayur-cream/30 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-ayur-sage/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Struggling with <span className="text-red-500">Outdated Systems</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Traditional clinic management is holding back your Ayurvedic practice from reaching its full potential.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl transform group-hover:scale-105 transition-transform duration-500 blur-xl"></div>
              <div className="relative bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-red-100 group-hover:border-red-200 transition-all duration-500 group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  📞
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Chaotic Communication</h3>
                <p className="text-gray-600 leading-relaxed">
                  Endless phone calls, missed appointments, and confused patients disrupting your carefully planned treatment schedules.
                </p>
                <div className="mt-6 flex items-center text-red-500 font-semibold">
                  <span className="mr-2">❌</span>
                  <span>60% time wasted on calls</span>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-2xl transform group-hover:scale-105 transition-transform duration-500 blur-xl"></div>
              <div className="relative bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-orange-100 group-hover:border-orange-200 transition-all duration-500 group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  📊
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Lost Patient Data</h3>
                <p className="text-gray-600 leading-relaxed">
                  Paper records getting lost, inconsistent treatment tracking, and no visibility into patient progress across sessions.
                </p>
                <div className="mt-6 flex items-center text-orange-500 font-semibold">
                  <span className="mr-2">❌</span>
                  <span>40% data inconsistency</span>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-red-500/10 rounded-2xl transform group-hover:scale-105 transition-transform duration-500 blur-xl"></div>
              <div className="relative bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-yellow-100 group-hover:border-yellow-200 transition-all duration-500 group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  💸
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Revenue Leakage</h3>
                <p className="text-gray-600 leading-relaxed">
                  No-shows, billing errors, and inefficient operations directly impacting your clinic's profitability and growth.
                </p>
                <div className="mt-6 flex items-center text-red-500 font-semibold">
                  <span className="mr-2">❌</span>
                  <span>25% revenue loss</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 p-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">The Cost of Doing Nothing</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-red-500">3 hrs</div>
                <div className="text-gray-600">wasted daily on admin</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-500">30%</div>
                <div className="text-gray-600">patient no-show rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-500">₹50k</div>
                <div className="text-gray-600">monthly revenue loss</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-500">5x</div>
                <div className="text-gray-600">slower than competitors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Premium Redesign */}
      <section id="features" className="section-padding bg-gradient-to-br from-primary/5 via-ayur-sage/10 to-ayur-cream/20 relative overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-br from-primary/20 to-ayur-gold/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-ayur-sage/20 to-ayur-saffron/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            
            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900">
              <span className="block">Everything You Need</span>
              <span className="block bg-gradient-to-r from-primary via-ayur-sage to-ayur-gold bg-clip-text text-transparent">
                In One Platform
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your Ayurvedic practice with intelligent tools designed specifically for Panchakarma clinics.
            </p>
          </div>
          
          {/* Premium Feature Cards */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Smart Scheduling Feature */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-ayur-sage/20 rounded-3xl transform group-hover:scale-105 transition-transform duration-700 blur-2xl"></div>
              <div className="relative bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-primary/20 group-hover:border-primary/40 transition-all duration-700 group-hover:-translate-y-2">
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-ayur-sage rounded-2xl flex items-center justify-center text-white mr-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Smart Scheduling</h3>
                    <p className="text-primary font-medium">Intelligent Appointment Management</p>
                  </div>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Intelligent calendar system that understands Panchakarma protocols, prevents conflicts, and optimizes therapist allocation for maximum efficiency.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-green-600">
                    <span className="mr-2">✅</span>
                    <span className="text-sm">Zero Double Bookings</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <span className="mr-2">✅</span>
                    <span className="text-sm">Protocol Compliance</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <span className="mr-2">✅</span>
                    <span className="text-sm">Resource Optimization</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <span className="mr-2">✅</span>
                    <span className="text-sm">Auto-Reminders</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Patient Journey Tracking */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-ayur-gold/20 to-ayur-saffron/20 rounded-3xl transform group-hover:scale-105 transition-transform duration-700 blur-2xl"></div>
              <div className="relative bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-ayur-gold/20 group-hover:border-ayur-gold/40 transition-all duration-700 group-hover:-translate-y-2">
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-ayur-gold to-ayur-saffron rounded-2xl flex items-center justify-center text-white mr-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9-2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Patient Journey</h3>
                    <p className="text-ayur-gold font-medium">Complete Treatment Tracking</p>
                  </div>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Comprehensive dashboard tracking every aspect of patient care from initial Prakriti analysis to post-treatment wellness monitoring.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-green-600">
                    <span className="mr-2">✅</span>
                    <span className="text-sm">Prakriti Analysis</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <span className="mr-2">✅</span>
                    <span className="text-sm">Progress Tracking</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <span className="mr-2">✅</span>
                    <span className="text-sm">Treatment History</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <span className="mr-2">✅</span>
                    <span className="text-sm">Outcome Analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Secondary Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/30">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Communication</h3>
              <p className="text-gray-600">
                Automated WhatsApp & SMS with personalized pre/post-care instructions.
              </p>
            </div>
            
            <div className="group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-green-500/30">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Herbal Inventory</h3>
              <p className="text-gray-600">
                Track medicines, oils, and herbs with expiry alerts and auto-reordering.
              </p>
            </div>
            
            <div className="group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/30">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Billing</h3>
              <p className="text-gray-600">
                Automated invoicing with treatment packages and payment tracking.
              </p>
            </div>
            
            <div className="group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-orange-500/30">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9-2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Real-time insights on revenue, patient satisfaction, and clinic performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            See How AyurSutra Transforms Care
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Plan</h3>
              <p className="text-muted-foreground">
                Create a comprehensive digital treatment plan for your patient with customized therapy sequences and timelines.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Automate</h3>
              <p className="text-muted-foreground">
                Our system automatically sends schedules, reminders, and personalized precautions to keep patients informed and prepared.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Track & Adjust</h3>
              <p className="text-muted-foreground">
                Monitor patient feedback and progress in real-time, adjusting treatment plans for optimal healing outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section-padding bg-ayur-cream">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Trusted by Clinics Worldwide
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="ayur-card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                  AS
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Dr. Anika Sharma</h4>
                  <p className="text-sm text-muted-foreground">Director, Prakriti Ayurveda</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "AyurSutra cut our admin time in half. Our patients are now more prepared and relaxed for their treatments."
              </p>
              <div className="flex mt-3">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" className="text-ayur-gold text-sm" />
                ))}
              </div>
            </div>
            <div className="ayur-card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center text-white font-bold mr-4">
                  RP
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Dr. Rajesh Patel</h4>
                  <p className="text-sm text-muted-foreground">Founder, Wellness Ayurveda Center</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "The automated patient communication has transformed our practice. No more missed appointments or confused patients."
              </p>
              <div className="flex mt-3">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" className="text-ayur-gold text-sm" />
                ))}
              </div>
            </div>
            <div className="ayur-card p-6 md:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                  MG
                </div>
                <div>
                  <h4 className="font-semibold text-primary">Dr. Meera Gupta</h4>
                  <p className="text-sm text-muted-foreground">Chief Therapist, Healing Springs Spa</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "Our treatment outcomes have improved significantly since implementing AyurSutra's tracking system."
              </p>
              <div className="flex mt-3">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" className="text-ayur-gold text-sm" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-padding bg-gradient-hero text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Elevate Your Practice?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Join the modern era of Ayurvedic care and transform how you manage your clinic.
          </p>
          <Button onClick={() => setIsDemoOpen(true)} size="lg" className="btn-cta text-lg px-12 py-4 font-bold">
            ✨ Schedule Your Free Demo
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">AyurSutra</h3>
              <p className="text-primary-foreground/80 mb-4">
                Empowering Ayurvedic practitioners with modern technology to deliver exceptional patient care.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><button onClick={() => scrollToSection('features')}>Features</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')}>How It Works</button></li>
                <li><button onClick={() => scrollToSection('testimonials')}>Testimonials</button></li>
                <li><button onClick={() => setIsDemoOpen(true)}>Request Demo</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-white transition-smooth">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2024 AyurSutra. All rights reserved. Transforming Ayurvedic care through technology.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center gradient-text">Welcome Back</DialogTitle>
            <p className="text-center text-muted-foreground">
              Sign in to access your AyurSutra dashboard
            </p>
          </DialogHeader>
          <form onSubmit={handleSignIn} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="loginEmail">Email Address *</Label>
              <Input 
                id="loginEmail" 
                type="email" 
                placeholder="Enter your email" 
                className="mt-1"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="loginPassword">Password *</Label>
              <div className="relative mt-1">
                <Input 
                  id="loginPassword" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">Forgot Password?</a>
            </div>
            <Button 
              type="submit" 
              className="w-full btn-primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button 
                  type="button"
                  onClick={switchToSignup}
                  className="text-primary hover:underline font-medium"
                >
                  Create one here
                </button>
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Signup Modal */}
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center gradient-text">Join AyurSutra</DialogTitle>
            <p className="text-center text-muted-foreground">
              Create your account and start modernizing your practice
            </p>
          </DialogHeader>
          <form onSubmit={handleSignUp} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="signupName">Full Name *</Label>
                <Input 
                  id="signupName" 
                  placeholder="Enter your full name"
                  className="mt-1"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signupClinicName">Clinic Name</Label>
                <Input 
                  id="signupClinicName" 
                  placeholder="Enter your clinic name"
                  className="mt-1"
                  value={signupForm.clinicName}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, clinicName: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="signupEmail">Email Address *</Label>
              <Input 
                id="signupEmail" 
                type="email" 
                placeholder="Enter your email"
                className="mt-1"
                value={signupForm.email}
                onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="signupPassword">Password *</Label>
              <div className="relative mt-1">
                <Input 
                  id="signupPassword" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Create a password (min. 6 characters)"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative mt-1">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm your password"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex items-start">
              <input type="checkbox" className="mr-2 mt-1" required />
              <span className="text-sm text-muted-foreground">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </span>
            </div>
            <Button 
              type="submit" 
              className="w-full btn-primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={switchToLogin}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Demo Request Modal */}
      <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center gradient-text">Request Your Free Demo</DialogTitle>
            <p className="text-center text-muted-foreground">
              See how AyurSutra can transform your practice in just 15 minutes.
            </p>
          </DialogHeader>
          <form className="space-y-4 mt-4">
            <div>
              <Label htmlFor="clinicName">Clinic Name</Label>
              <Input id="clinicName" placeholder="Enter your clinic name" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="yourName">Your Name</Label>
              <Input id="yourName" placeholder="Enter your full name" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="demoEmail">Email Address</Label>
              <Input id="demoEmail" type="email" placeholder="Enter your email" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="Enter your phone number" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="message">Tell us about your practice (optional)</Label>
              <Textarea id="message" placeholder="Number of therapists, monthly patients, current challenges..." className="mt-1" rows={3} />
            </div>
            <Button type="submit" className="w-full btn-primary">
              Schedule Demo
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AyurSutraLanding;