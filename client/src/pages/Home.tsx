import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Heart, Users, CheckCircle2, ArrowRight, Shield, Recycle, Globe } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Heart className="w-8 h-8 text-red-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">VIX</h1>
                <p className="text-sm text-gray-600">Verified Inhaler Exchange</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-green-500" /> Secure</span>
              <span className="flex items-center gap-1"><Recycle className="w-4 h-4 text-blue-500" /> Sustainable</span>
              <span className="flex items-center gap-1"><Globe className="w-4 h-4 text-purple-500" /> Global Impact</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          {/* Medical-themed background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/10 to-teal-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
          </div>
          <div className="container mx-auto relative max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-700 mb-6 border border-white/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Securing healthcare supply chains</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Transforming <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Medical Waste</span> Into
                  <span className="block bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">Life-Saving Care</span>
                </h1>
                
                <p className="text-xl text-gray-700 mb-8 max-w-2xl lg:mx-0">
                  Join the global movement to redistribute unused inhalers and oxygen supplies through our secure, verified network of trusted healthcare providers.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                  <Button 
                    onClick={() => navigate("/donor")}
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg group"
                  >
                    Donate Inhalers
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    onClick={() => navigate("/recipient")}
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 px-8 py-4 text-lg"
                  >
                    Request Supplies
                  </Button>
                </div>
                
                <div className="flex flex-wrap justify-center gap-6 max-w-lg mx-auto lg:mx-0">
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Verified Donations</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Secure Tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Medical Safety</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-8 border border-blue-300/30 overflow-hidden">
                  {/* Animated background elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl"></div>
                  </div>
                  
                  <div className="relative z-10">
                    {/* Advanced Inhaler Illustration */}
                    <div className="flex justify-center mb-8">
                      <div className="relative">
                        {/* Main inhaler container */}
                        <div className="w-52 h-72 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center p-8 border border-white/30 shadow-2xl">
                          <div className="text-center">
                            {/* Inhaler visualization */}
                            <div className="w-20 h-32 bg-gradient-to-b from-blue-300/80 to-blue-600/80 rounded-xl mx-auto mb-4 relative shadow-lg border border-white/20">
                              {/* Inhaler cap */}
                              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-blue-700/90 rounded-t-lg border border-white/30"></div>
                              {/* Inhaler mouthpiece */}
                              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-blue-800/90 rounded-b-lg border border-white/30"></div>
                              {/* Inhaler content indicator */}
                              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1 h-20 bg-blue-200/40 rounded-full"></div>
                              {/* Inhaler dose counter */}
                              <div className="absolute top-4 right-2 w-6 h-6 bg-black/20 rounded-full flex items-center justify-center text-xs font-bold text-white border border-white/20">
                                <span>20</span>
                              </div>
                            </div>
                            <div className="text-base font-semibold text-white/90 mt-2">Salbutamol</div>
                            <div className="text-sm text-white/70">200 doses remaining</div>
                          </div>
                        </div>
                        
                        {/* Floating elements */}
                        <div className="absolute -top-6 -right-6 w-16 h-16 bg-green-400/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-green-300/40 animate-bounce shadow-lg">
                          <CheckCircle2 className="w-8 h-8 text-green-300" />
                        </div>
                        <div className="absolute -bottom-6 -left-6 w-14 h-14 bg-blue-400/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-300/40 animate-pulse shadow-lg">
                          <Heart className="w-6 h-6 text-blue-300" />
                        </div>
                        <div className="absolute top-1/2 -right-10 w-12 h-12 bg-purple-400/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-purple-300/40 animate-ping shadow-lg">
                          <Users className="w-5 h-5 text-purple-300" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2">Blockchain-Verified Supply Chain</h3>
                      <p className="text-white/80 mb-4">Each inhaler is tracked through our immutable audit trail</p>
                      <div className="flex justify-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span>Donated</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <span>Verified</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                          <span>Delivered</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Three Main Screens */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How VIX Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Three simple steps to make a global impact</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Donor Screen */}
              <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-100">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Users className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-blue-600 transition-colors">
                  Donate Inhalers
                </h3>
                <p className="text-gray-600 mb-6 text-center leading-relaxed">
                  Anonymously register your unused, unexpired inhalers for donation. Help reduce medical waste and save lives in your community.
                </p>
                <Button
                  onClick={() => navigate("/donor")}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 group-hover:shadow-lg transition-all"
                >
                  Go to Donor Portal
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Recipient Screen */}
              <div className="group bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-red-100">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <Heart className="w-10 h-10 text-red-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-red-600 transition-colors">
                  Request Supplies
                </h3>
                <p className="text-gray-600 mb-6 text-center leading-relaxed">
                  View verified, available inhalers from your nearest clinic hub. Request what you need with a valid prescription from qualified healthcare providers.
                </p>
                <Button
                  onClick={() => navigate("/recipient")}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 group-hover:shadow-lg transition-all"
                >
                  View Available Supplies
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* CVM Screen */}
              <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-green-100">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-green-600 transition-colors">
                  Verify & Track
                </h3>
                <p className="text-gray-600 mb-6 text-center leading-relaxed">
                  Clinic staff: Verify donations and log them to the immutable audit trail. Ensure every inhaler is properly tracked and authenticated.
                </p>
                <Button
                  onClick={() => navigate("/cvm")}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 group-hover:shadow-lg transition-all"
                >
                  Clinic Verification Module
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        

        {/* Process Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Secure Process</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Every inhaler follows a verified, transparent journey from donation to delivery</p>
            </div>
            
            <div className="relative">
              {/* Process timeline */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform -translate-y-1/2 rounded-full"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                <div className="group text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <div className="relative z-10 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Donate</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Register unused inhalers anonymously through our secure portal</p>
                </div>
                
                <div className="group text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200">
                  <div className="relative z-10 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Verify</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Clinic staff verify authenticity and log to immutable audit trail</p>
                </div>
                
                <div className="group text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
                  <div className="relative z-10 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Inventory</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Verified supplies are catalogued and made available in real-time</p>
                </div>
                
                <div className="group text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-pink-200">
                  <div className="relative z-10 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                      <span className="text-2xl font-bold text-white">4</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Request</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Patients request with valid prescription from nearest clinic hub</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-indigo-50 to-blue-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Healthcare Professionals</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Real stories from donors, recipients, and healthcare providers</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                    <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Dr. Sarah Chen" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Dr. Sarah Chen</h4>
                    <p className="text-sm text-gray-600">Pulmonologist</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"VIX has revolutionized our clinic's supply chain. We've reduced waste by 78% while serving more patients than ever before."</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461c.969 0 1.371-1.24.588-1.81l-1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Maria Johnson" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Maria Johnson</h4>
                    <p className="text-sm text-gray-600">Patient Advocate</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"Thanks to VIX, I was able to access life-saving medication when I couldn't afford it. The verification process gave me confidence in the quality."</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461c.969 0 1.371-1.24.588-1.81l-1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Robert Anderson" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Robert Anderson</h4>
                    <p className="text-sm text-gray-600">Healthcare Director</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"The blockchain verification system ensures complete transparency. Our audit trails are now tamper-proof and fully compliant with regulations."</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461c.969 0 1.371-1.24.588-1.81l-1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>


      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-red-500" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">VIX</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Verified Inhaler Exchange is transforming healthcare waste into life-saving opportunities through secure, community-based sharing networks.
              </p>
              <div className="flex gap-4">\                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Secure & Verified</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Recycle className="w-4 h-4" />
                  <span>Sustainable Impact</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate("/donor")} className="hover:text-white transition-colors">Donor Portal</button></li>
                <li><button onClick={() => navigate("/recipient")} className="hover:text-white transition-colors">Recipient Hub</button></li>
                <li><button onClick={() => navigate("/cvm")} className="hover:text-white transition-colors">Clinic Verification</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Impact Reports</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Mission</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Global Impact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partnerships</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2024 VIX: Verified Inhaler Exchange | Hackathon MVP | Building Resilience in Healthcare</p>
            <p className="mt-2">Transforming waste into life-saving care, one inhaler at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
