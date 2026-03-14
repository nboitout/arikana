import React, { useState, useEffect } from 'react';
import { Home, Calendar, ShoppingBag, User, MoreHorizontal, ChevronRight, Eye, EyeOff } from 'lucide-react';
import './App.css';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, addDoc, collection, getDocs } from 'firebase/firestore';

// EmailJS configuration - You'll need to sign up at emailjs.com
const EMAILJS_SERVICE_ID = 'service_arikana'; // Replace with your service ID
const EMAILJS_TEMPLATE_ID = 'template_arikana'; // Replace with your template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your public key

// Firebase configuration
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAcIzGaIAc_gOmR81AuIkeRdEW1tGXTV6k",
  authDomain: "arikana-1e213.firebaseapp.com",
  projectId: "arikana-1e213",
  storageBucket: "arikana-1e213.firebasestorage.app",
  messagingSenderId: "312663898307",
  appId: "1:312663898307:web:dbfc24e1761204e3734a76",
  measurementId: "G-3FN4SH1C07"
};

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Firebase Connection Test Function
const testFirebaseConnection = async () => {
  try {
    const timestamp = new Date().toISOString();
    
    // Write test data
    const testRef = await addDoc(collection(db, 'test'), {
      message: 'Firebase connection test',
      timestamp: timestamp,
      status: 'success'
    });
    
    console.log('✅ Firebase Write Success! Document ID:', testRef.id);
    
    // Read test data
    const querySnapshot = await getDocs(collection(db, 'test'));
    const docs = querySnapshot.docs.map(doc => doc.data());
    
    console.log('✅ Firebase Read Success! Documents:', docs.length);
    
    return {
      success: true,
      message: `✅ Firebase Connected!\nWrote & read test data`,
      docCount: docs.length,
      latestWrite: timestamp
    };
  } catch (error) {
    console.error('❌ Firebase Connection Error:', error);
    return {
      success: false,
      message: `❌ Firebase Error:\n${error.message}`,
      error: error
    };
  }
};

// Load EmailJS library
const loadEmailJS = () => {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js';
  script.onload = () => {
    window.emailjs.init(EMAILJS_PUBLIC_KEY);
  };
  document.head.appendChild(script);
};

// Count-up animation hook
const useCountUp = (targetValue, duration = 1500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (targetValue === 0) {
      setCount(0);
      return;
    }

    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setCount(Math.floor(targetValue * progress));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(targetValue);
      }
    };

    requestAnimationFrame(animate);
  }, [targetValue, duration]);

  return count;
};

export default function ArikanaApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'signin'
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [firebaseTestResult, setFirebaseTestResult] = useState(null);
  
  // Health questionnaire data
  const [healthData, setHealthData] = useState(() => {
    const saved = localStorage.getItem('arikanaHealthData');
    if (saved) return JSON.parse(saved);
    return {
      lastUpdated: null,
      bodyRegions: {
        head: { affected: false, severity: 'none', notes: '' },
        neck: { affected: false, severity: 'none', notes: '' },
        shoulders: { affected: false, severity: 'none', notes: '' },
        upperBack: { affected: false, severity: 'none', notes: '' },
        lowerBack: { affected: false, severity: 'none', notes: '' },
        elbows: { affected: false, severity: 'none', notes: '' },
        wrists: { affected: false, severity: 'none', notes: '' },
        hips: { affected: false, severity: 'none', notes: '' },
        knees: { affected: false, severity: 'none', notes: '' },
        ankles: { affected: false, severity: 'none', notes: '' },
        feet: { affected: false, severity: 'none', notes: '' },
      }
    };
  });
  
  // Booking flow state (for confirmation page)
  const [bookingView, setBookingView] = useState('classes'); // 'classes', 'detail', 'confirmation', 'warning'
  const [lastBookedClass, setLastBookedClass] = useState(null);
  const [selectedBookingClass, setSelectedBookingClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  
  // For Book tab: calendar shows 7 days from this date (doesn't change when selecting a day)
  const [bookingCalendarStart, setBookingCalendarStart] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  // Recurring weekly pattern (Mon=1, Tue=2, etc.)
  const [recurringPattern, setRecurringPattern] = useState(() => {
    const saved = localStorage.getItem('arikanaRecurringPattern');
    if (saved) return JSON.parse(saved);
    return {
      0: [], // Sunday - Rest Day
      1: [ // Monday
        { id: 1, name: 'Pilates Mat', time: '09:00', duration: '60 min', instructor: 'Angelina', spots: 8 },
        { id: 2, name: 'Core Strength', time: '10:30', duration: '45 min', instructor: 'Nicolas', spots: 12 },
        { id: 3, name: 'Speed Skating', time: '09:30', duration: '50 min', instructor: 'Sergey', spots: 11 },
      ],
      2: [ // Tuesday
        { id: 4, name: 'Pelvic Curl Flow', time: '08:00', duration: '50 min', instructor: 'Angelina', spots: 10 },
        { id: 5, name: 'Ice Skating with Grace', time: '07:00', duration: '60 min', instructor: 'Sergey', spots: 14 },
        { id: 6, name: 'Pilates Reformer', time: '09:00', duration: '60 min', instructor: 'Nicolas', spots: 8 },
        { id: 7, name: 'Advanced Pilates', time: '18:30', duration: '60 min', instructor: 'Nicolas', spots: 6 },
      ],
      3: [ // Wednesday
        { id: 8, name: 'Deep Core Activation', time: '11:00', duration: '60 min', instructor: 'Angelina', spots: 9 },
        { id: 9, name: 'Pilates Mat', time: '17:00', duration: '50 min', instructor: 'Nicolas', spots: 15 },
        { id: 10, name: 'Speed Skating', time: '09:30', duration: '50 min', instructor: 'Sergey', spots: 11 },
      ],
      4: [ // Thursday
        { id: 11, name: 'Advanced Pelvic Techniques', time: '17:00', duration: '60 min', instructor: 'Angelina', spots: 7 },
        { id: 12, name: 'Core Strength', time: '10:30', duration: '45 min', instructor: 'Nicolas', spots: 12 },
        { id: 13, name: 'Ice Skating Techniques', time: '16:00', duration: '60 min', instructor: 'Sergey', spots: 8 },
      ],
      5: [ // Friday
        { id: 14, name: 'Pilates Fusion', time: '19:00', duration: '55 min', instructor: 'Angelina', spots: 12 },
        { id: 15, name: 'Pilates Reformer', time: '09:00', duration: '60 min', instructor: 'Nicolas', spots: 7 },
        { id: 16, name: 'Crossfit on Ice', time: '18:00', duration: '55 min', instructor: 'Sergey', spots: 6 },
      ],
      6: [ // Saturday
        { id: 17, name: 'Pelvic Curl Flow', time: '10:30', duration: '50 min', instructor: 'Angelina', spots: 6 },
        { id: 18, name: 'Advanced Pilates', time: '18:30', duration: '60 min', instructor: 'Nicolas', spots: 5 },
        { id: 19, name: 'Speed Skating', time: '09:30', duration: '50 min', instructor: 'Sergey', spots: 11 },
      ],
    };
  });

  // Date-specific overrides (one-shot changes like canceling a single Friday)
  // Structure: { '2026-03-13': [] } means Friday March 13 has NO classes (canceled)
  // or { '2026-03-13': [modified classes] } means override that specific date
  const [dateOverrides, setDateOverrides] = useState(() => {
    const saved = localStorage.getItem('arikanaDateOverrides');
    if (saved) return JSON.parse(saved);
    return {};
  });

  // Helper: Get classes for a specific date (merges recurring + overrides)
  const getClassesForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    
    // If this date has an override, use it
    if (dateOverrides[dateStr] !== undefined) {
      return dateOverrides[dateStr];
    }
    
    // Otherwise, use recurring pattern for this day of week
    return recurringPattern[dayOfWeek] || [];
  };

  // Brand color
  const ARIKANA_COLOR = '#B69B4D';

  useEffect(() => {
    // Load EmailJS
    loadEmailJS();

    // Check if user data exists in localStorage (mock auth for now)
    const savedUser = localStorage.getItem('arikanaUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Load bookings from localStorage
    const savedBookings = localStorage.getItem('arikanaBookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }

    setIsLoading(false);
  }, []);

  // Save recurringPattern to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('arikanaRecurringPattern', JSON.stringify(recurringPattern));
  }, [recurringPattern]);

  // Save dateOverrides to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('arikanaDateOverrides', JSON.stringify(dateOverrides));
  }, [dateOverrides]);

  // Save healthData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('arikanaHealthData', JSON.stringify(healthData));
  }, [healthData]);

  // Auth Screens
  const AuthScreen = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      setError('');
      setSuccess('');
    };

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateMobile = (mobile) => {
      return /^\d{10,}$/.test(mobile.replace(/\D/g, ''));
    };

    const sendSignUpEmail = async (userData) => {
      try {
        setIsSending(true);
        
        // Using EmailJS to send email
        if (window.emailjs) {
          const templateParams = {
            to_email: 'nicolasboitout@hotmail.com',
            from_email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            user_email: userData.email,
            user_mobile: userData.mobile,
            signup_date: new Date().toLocaleDateString(),
            signup_time: new Date().toLocaleTimeString(),
            message: `New sign-up from ${userData.firstName} ${userData.lastName}`
          };

          await window.emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
          );
          
          console.log('Email sent successfully!');
        }
      } catch (error) {
        console.error('Email sending failed:', error);
        // Don't prevent signup if email fails
      } finally {
        setIsSending(false);
      }
    };

    const handleSignUp = async (e) => {
      e.preventDefault();
      
      if (authMode === 'signup') {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobile) {
          setError('All fields are required');
          return;
        }
        if (!validateEmail(formData.email)) {
          setError('Invalid email format');
          return;
        }
        if (!validateMobile(formData.mobile)) {
          setError('Invalid mobile number (minimum 10 digits)');
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        // Mock authentication - save to localStorage
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
          id: Date.now()
        };

        // Send sign-up email
        await sendSignUpEmail(userData);

        localStorage.setItem('arikanaUser', JSON.stringify(userData));
        setCurrentUser(userData);
        setSuccess('Account created successfully! Welcome to Arikana! 🎉');
      } else {
        // Sign In mode
        if (!formData.email || !formData.password) {
          setError('Email and password are required');
          return;
        }
        if (!validateEmail(formData.email)) {
          setError('Invalid email format');
          return;
        }

        // Mock sign in - for demo, accept any email
        const userData = {
          firstName: 'Anya',
          lastName: 'Glushkova',
          email: formData.email,
          mobile: '+40 123 456 789',
          id: Date.now(),
          role: 'lead-trainer'
        };
        localStorage.setItem('arikanaUser', JSON.stringify(userData));
        setCurrentUser(userData);
      }
    };

    return (
      <div className="h-screen flex flex-col items-center justify-center max-w-md mx-auto overflow-y-auto" style={{ backgroundColor: ARIKANA_COLOR }}>
        {/* Logo Section */}
        <div className="text-center mb-8 flex-1 flex flex-col items-center justify-center py-8">
          {/* Spiral Logo */}
          <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Outer circle */}
              <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="15" opacity="0.9"/>
              {/* Spiral */}
              <path
                d="M 100 20 Q 150 50 150 100 Q 150 150 100 150 Q 50 150 50 100 Q 50 60 90 50 Q 130 45 140 85"
                fill="none"
                stroke="white"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Center circle */}
              <circle cx="100" cy="100" r="25" fill="white" opacity="0.9"/>
              <circle cx="100" cy="100" r="15" fill={ARIKANA_COLOR}/>
            </svg>
            {/* Light rays */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-8 bg-white rounded-full" style={{opacity: 0.9}}></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -rotate-45 w-3 h-8 bg-white rounded-full" style={{opacity: 0.9}}></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 rotate-45 w-3 h-8 bg-white rounded-full" style={{opacity: 0.9}}></div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-light text-white mb-2">arikana</h1>
          <p className="text-white text-opacity-90 text-sm tracking-wide">Yoga • Pilates • Mindfulness</p>
        </div>

        {/* Form Section */}
        <div className="w-full px-6 pb-12">
          <form onSubmit={handleSignUp} className="space-y-4">
            {authMode === 'signup' && (
              <>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg text-sm placeholder-stone-500"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg text-sm placeholder-stone-500"
                />
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg text-sm placeholder-stone-500"
            />

            {authMode === 'signup' && (
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg text-sm placeholder-stone-500"
              />
            )}

            {/* Password with eye toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg text-sm placeholder-stone-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-500 hover:text-stone-700 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {authMode === 'signup' && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg text-sm placeholder-stone-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-500 hover:text-stone-700 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}

            {error && <p className="text-red-300 text-sm text-center">{error}</p>}
            {success && <p className="text-green-200 text-sm text-center">{success}</p>}

            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-white text-stone-900 font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity mt-6 disabled:opacity-50"
            >
              {isSending ? 'Creating Account...' : (authMode === 'signup' ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="text-center mt-6">
            <p className="text-white text-opacity-80 text-sm">
              {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setAuthMode(authMode === 'signup' ? 'signin' : 'signup');
                  setFormData({ firstName: '', lastName: '', email: '', mobile: '', password: '', confirmPassword: '' });
                  setError('');
                  setSuccess('');
                }}
                className="text-white font-semibold underline hover:opacity-80 transition-opacity"
              >
                {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Test Email Button */}
        <div className="w-full text-center py-4 border-t border-white border-opacity-20">
          <button
            onClick={async () => {
              try {
                if (window.emailjs) {
                  const templateParams = {
                    to_email: 'nicolasboitout@hotmail.com',
                    from_email: 'test@arikana.com',
                    first_name: 'Test',
                    last_name: 'User',
                    user_email: 'test@arikana.com',
                    user_mobile: '+40 123 456 789',
                    signup_date: new Date().toLocaleDateString(),
                    signup_time: new Date().toLocaleTimeString(),
                    message: '🧪 TEST EMAIL - Email functionality is working correctly!'
                  };

                  await window.emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    templateParams
                  );
                  
                  alert('✅ Test email sent successfully!\n\nCheck nicolasboitout@hotmail.com');
                } else {
                  alert('⚠️ EmailJS not loaded yet. Please wait a moment and try again.');
                }
              } catch (error) {
                alert('❌ Email sending failed:\n' + error.message + '\n\nCheck your EmailJS configuration');
              }
            }}
            className="text-white text-opacity-70 hover:text-opacity-100 transition-all text-xs underline"
          >
            🧪 Test Email Functionality
          </button>
        </div>

        {/* Footer */}
        <div className="w-full text-center pb-6">
          <p className="text-white text-opacity-70 text-xs">POWERED BY</p>
          <p className="text-white font-light text-sm">arikana studios</p>
        </div>
      </div>
    );
  };

  // Show auth screen if not logged in
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center" style={{ backgroundColor: ARIKANA_COLOR }}></div>;
  }

  if (!currentUser) {
    return <AuthScreen />;
  }

  // Main app continues from here...

  // Home Tab Content
  const HomeTab = ({ bookings, setBookings, healthData, setHealthData, firebaseTestResult, setFirebaseTestResult }) => {
    const [showHealthForm, setShowHealthForm] = useState(false);
    const [healthForm, setHealthForm] = useState(healthData.bodyRegions);
    const count172 = useCountUp(172, 1200);
    const count100 = useCountUp(100, 1200);
    const [bookingToCancel, setBookingToCancel] = useState(null);
    const [testingFirebase, setTestingFirebase] = useState(false);

    const handleFirebaseTest = async () => {
      setTestingFirebase(true);
      const result = await testFirebaseConnection();
      setFirebaseTestResult(result);
      setTestingFirebase(false);
    };

    // Get next 2 upcoming sessions based on current time
    const getNextUpcomingSessions = () => {
      const now = new Date();
      const allSessions = [];

      // Class schedule - comprehensive
      const classSchedule = {
        '2026-03-09': [ // Monday
          { id: 1, name: 'Pilates Mat', time: '09:00', instructor: 'Angelina', spots: 8 },
          { id: 2, name: 'Core Strength', time: '10:30', instructor: 'Nicolas', spots: 12 },
          { id: 3, name: 'Speed Skating', time: '09:30', instructor: 'Sergey', spots: 11 },
        ],
        '2026-03-10': [ // Tuesday
          { id: 4, name: 'Pilates Reformer', time: '08:00', instructor: 'Nicolas', spots: 10 },
          { id: 5, name: 'Pelvic Curl Flow', time: '10:00', instructor: 'Angelina', spots: 9 },
          { id: 6, name: 'Ice Skating with Grace', time: '14:00', instructor: 'Sergey', spots: 7 },
          { id: 7, name: 'Advanced Pilates', time: '18:00', instructor: 'Nicolas', spots: 5 },
        ],
        '2026-03-11': [ // Wednesday (today)
          { id: 8, name: 'Deep Core Activation', time: '09:00', instructor: 'Angelina', spots: 6 },
          { id: 9, name: 'Pilates Mat', time: '11:00', instructor: 'Nicolas', spots: 8 },
          { id: 10, name: 'Speed Skating', time: '15:00', instructor: 'Sergey', spots: 10 },
        ],
        '2026-03-12': [ // Thursday
          { id: 11, name: 'Advanced Pelvic Techniques', time: '10:00', instructor: 'Angelina', spots: 4 },
          { id: 12, name: 'Core Strength', time: '12:00', instructor: 'Nicolas', spots: 9 },
          { id: 13, name: 'Ice Skating Techniques', time: '16:00', instructor: 'Sergey', spots: 6 },
        ],
        '2026-03-13': [ // Friday
          { id: 14, name: 'Pilates Fusion', time: '09:30', instructor: 'Angelina', spots: 7 },
          { id: 15, name: 'Pilates Reformer', time: '14:00', instructor: 'Nicolas', spots: 11 },
          { id: 16, name: 'Crossfit on Ice', time: '17:00', instructor: 'Sergey', spots: 8 },
        ],
        '2026-03-14': [ // Saturday
          { id: 17, name: 'Pelvic Curl Flow', time: '10:00', instructor: 'Angelina', spots: 5 },
          { id: 18, name: 'Advanced Pilates', time: '15:00', instructor: 'Nicolas', spots: 9 },
          { id: 19, name: 'Speed Skating', time: '17:30', instructor: 'Sergey', spots: 12 },
        ],
        // Sunday 2026-03-15: REST DAY - NO CLASSES
        '2026-03-16': [ // Monday
          { id: 20, name: 'Pilates Mat', time: '09:00', instructor: 'Angelina', spots: 8 },
          { id: 21, name: 'Pilates Reformer', time: '14:00', instructor: 'Nicolas', spots: 10 },
          { id: 22, name: 'Ice Skating with Grace', time: '16:30', instructor: 'Sergey', spots: 7 },
        ],
      };

      // Flatten all sessions with dates
      Object.keys(classSchedule).forEach(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        classSchedule[dateStr].forEach(session => {
          const sessionTime = new Date(year, month - 1, day);
          const [hours, minutes] = session.time.split(':').map(Number);
          sessionTime.setHours(hours, minutes, 0, 0);

          // Get day name
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const dayName = dayNames[sessionTime.getDay()];
          const dateStr2 = sessionTime.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

          allSessions.push({
            id: session.id,
            name: session.name,
            time: session.time,
            instructor: session.instructor,
            spots: session.spots,
            dateObj: sessionTime,
            displayDate: `${dayName}, ${dateStr2}`,
          });
        });
      });

      // Filter sessions that are in the future (after now)
      const futureSessions = allSessions.filter(s => s.dateObj > now);

      // Sort by date/time
      futureSessions.sort((a, b) => a.dateObj - b.dateObj);

      // Return only next 2
      return futureSessions.slice(0, 2);
    };

    const nextSessions = getNextUpcomingSessions();

    return (
      <div className="pb-28">
        {/* Header with gradient */}
        <div style={{ background: `linear-gradient(to bottom, ${ARIKANA_COLOR}, ${ARIKANA_COLOR}cc)` }} className="text-white px-6 py-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <p className="text-sm font-light mb-1">Hi, Anechka</p>
              <h1 className="text-2xl font-light">Welcome to Arikana Studio</h1>
            </div>
            <button
              onClick={handleFirebaseTest}
              disabled={testingFirebase}
              className="ml-3 px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
              title="Test Firebase connection"
            >
              {testingFirebase ? '⏳...' : '🔥 Test'}
            </button>
          </div>
          
          {/* Firebase Test Result */}
          {firebaseTestResult && (
            <div className={`text-xs p-2 rounded-lg ${firebaseTestResult.success ? 'bg-green-500 bg-opacity-20' : 'bg-red-500 bg-opacity-20'}`}>
              <p className="whitespace-pre-wrap text-white">{firebaseTestResult.message}</p>
              {firebaseTestResult.success && firebaseTestResult.docCount !== undefined && (
                <p className="text-xs mt-1 opacity-80">📊 Docs in test collection: {firebaseTestResult.docCount}</p>
              )}
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div className="px-6 mt-6 mb-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Achievements</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
            {/* Card 1 - Animated Count */}
            <div
              style={{ backgroundColor: ARIKANA_COLOR }}
              className="flex-shrink-0 w-40 text-white rounded-3xl p-5 snap-center relative"
            >
              <p className="text-4xl font-bold mb-3">{count172}</p>
              <p className="text-xs font-light opacity-95 whitespace-pre-line leading-tight">Total classes
Since Feb 11, 2025</p>
            </div>

            {/* Card 2 */}
            <div
              style={{ backgroundColor: ARIKANA_COLOR }}
              className="flex-shrink-0 w-40 text-white rounded-3xl p-5 snap-center relative"
            >
              <p className="text-4xl font-bold mb-3">0</p>
              <p className="text-xs font-light opacity-95 whitespace-pre-line leading-tight">Classes this month
Since Mar 1, 2026</p>
            </div>
          </div>
        </div>

        {/* My Booking */}
        <div className="px-6 mb-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">My Booking</h2>
          {(() => {
            const now = new Date();
            // Filter out past bookings and get closest 3
            const futureBookings = bookings.filter(b => b.dateObj > now);
            
            if (futureBookings.length > 0) {
              return (
                <div className="space-y-2 mb-4">
                  {futureBookings.slice(0, 3).map((booking) => (
                    <button type="button" key={booking.id} onClick={() => setBookingToCancel(booking)} className="w-full text-left bg-gradient-to-r rounded-3xl p-5 text-white hover:opacity-85 transition-opacity cursor-pointer" style={{ background: `linear-gradient(135deg, ${ARIKANA_COLOR}, ${ARIKANA_COLOR}dd)` }}>
                      <h3 className="font-semibold text-lg">{booking.className}</h3>
                      <p className="text-sm opacity-90 mt-2">{booking.displayDate} | {booking.time}</p>
                      <p className="text-xs opacity-80 mt-1">with {booking.instructor}</p>
                    </button>
                  ))}
                </div>
              );
            } else {
              return (
                <div className="bg-gray-100 rounded-3xl p-6 mb-4 text-center">
                  <p className="text-stone-700 text-base font-normal">Nothing is currently scheduled</p>
                </div>
              );
            }
          })()}
        </div>

        {/* My Health */}
        <div className="px-6 mb-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">My Health</h2>
          {!showHealthForm && (
            <>
              {healthData.lastUpdated ? (
                <div>
                  <div className="bg-green-50 border border-green-200 rounded-3xl p-4 mb-3">
                    <p className="text-green-900 text-sm font-medium">Last Updated: {new Date(healthData.lastUpdated).toLocaleDateString()}</p>
                    <p className="text-green-800 text-xs mt-1">
                      {Object.values(healthData.bodyRegions).filter(r => r.affected).length} area(s) affected
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHealthForm(true)}
                    style={{ backgroundColor: ARIKANA_COLOR }}
                    className="w-full text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer text-sm"
                  >
                    📋 Update Health Info
                  </button>
                </div>
              ) : (
                <div>
                  <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 mb-3">
                    <p className="text-amber-900 text-sm font-medium">Let us know how you're feeling</p>
                    <p className="text-amber-800 text-xs mt-1">This helps trainers personalize your sessions</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHealthForm(true)}
                    style={{ backgroundColor: ARIKANA_COLOR }}
                    className="w-full text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer text-sm"
                  >
                    📋 Complete Health Assessment
                  </button>
                </div>
              )}
            </>
          )}

          {/* Health Questionnaire Form */}
          {showHealthForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl my-8">
                {/* Header */}
                <div style={{ background: `linear-gradient(to bottom, ${ARIKANA_COLOR}, ${ARIKANA_COLOR}cc)` }} className="text-white px-6 py-4 rounded-t-3xl">
                  <h3 className="text-xl font-bold">Health Assessment</h3>
                  <p className="text-xs text-yellow-100 mt-1">Let us know which areas need attention</p>
                </div>

                {/* Body Regions List */}
                <div className="px-6 py-6 max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {[
                      { id: 'head', label: 'Head' },
                      { id: 'neck', label: 'Neck' },
                      { id: 'shoulders', label: 'Shoulders' },
                      { id: 'upperBack', label: 'Upper Back' },
                      { id: 'lowerBack', label: 'Lower Back' },
                      { id: 'elbows', label: 'Elbows' },
                      { id: 'wrists', label: 'Wrists' },
                      { id: 'hips', label: 'Hips' },
                      { id: 'knees', label: 'Knees' },
                      { id: 'ankles', label: 'Ankles' },
                      { id: 'feet', label: 'Feet' },
                    ].map(({ id, label }) => (
                      <div key={id} className="border border-stone-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="flex items-center gap-2 cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={healthForm[id].affected}
                              onChange={(e) => {
                                setHealthForm({
                                  ...healthForm,
                                  [id]: { ...healthForm[id], affected: e.target.checked }
                                });
                              }}
                              className="w-4 h-4 cursor-pointer"
                            />
                            <span className="font-medium text-stone-900">{label}</span>
                          </label>
                        </div>
                        
                        {healthForm[id].affected && (
                          <div className="ml-6 space-y-2">
                            <select
                              value={healthForm[id].severity}
                              onChange={(e) => {
                                setHealthForm({
                                  ...healthForm,
                                  [id]: { ...healthForm[id], severity: e.target.value }
                                });
                              }}
                              className="w-full border border-stone-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            >
                              <option value="mild">Mild discomfort</option>
                              <option value="moderate">Moderate pain</option>
                              <option value="severe">Severe pain</option>
                            </select>
                            <textarea
                              value={healthForm[id].notes}
                              onChange={(e) => {
                                setHealthForm({
                                  ...healthForm,
                                  [id]: { ...healthForm[id], notes: e.target.value }
                                });
                              }}
                              placeholder="Add details... (optional)"
                              className="w-full border border-stone-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-600"
                              rows="2"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 border-t border-stone-200 flex gap-3 rounded-b-3xl bg-stone-50">
                  <button
                    type="button"
                    onClick={() => setShowHealthForm(false)}
                    className="flex-1 text-stone-600 border-2 border-stone-300 py-2.5 rounded-lg font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHealthData({
                        lastUpdated: new Date().toISOString(),
                        bodyRegions: healthForm
                      });
                      setShowHealthForm(false);
                    }}
                    style={{ backgroundColor: ARIKANA_COLOR }}
                    className="flex-1 text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    ✓ Save Health Info
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cancellation Modal */}
        {bookingToCancel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
              {(() => {
                const now = new Date();
                const classTime = bookingToCancel.dateObj;
                const timeDiffMs = classTime - now;
                const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
                const canCancel = timeDiffHours > 2;
                return (
                  <>
                    <h2 className="text-xl font-bold text-stone-900 mb-1">{bookingToCancel.className}</h2>
                    <p className="text-sm text-stone-600 mb-6">{bookingToCancel.displayDate} at {bookingToCancel.time}</p>
                    {canCancel ? (
                      <>
                        <p className="text-sm text-stone-700 mb-6">Are you sure you want to cancel this booking?</p>
                        <div className="flex gap-3">
                          <button type="button" onClick={() => setBookingToCancel(null)} className="flex-1 border-2 border-stone-300 text-stone-900 py-3 rounded-xl font-semibold hover:bg-stone-50 transition-colors cursor-pointer">Keep</button>
                          <button type="button" onClick={() => { const updatedBookings = bookings.filter(b => b.id !== bookingToCancel.id); setBookings(updatedBookings); localStorage.setItem('arikanaBookings', JSON.stringify(updatedBookings)); setBookingToCancel(null); }} style={{ backgroundColor: ARIKANA_COLOR }} className="flex-1 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity cursor-pointer">Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                          <p className="text-sm text-red-800 font-semibold mb-2">❌ Cannot Cancel</p>
                          <p className="text-xs text-red-700">Cancellations are not allowed within 2 hours of the class start time. Please contact support if you need to cancel urgently.</p>
                        </div>
                        <button type="button" onClick={() => setBookingToCancel(null)} style={{ backgroundColor: ARIKANA_COLOR }} className="w-full text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity cursor-pointer">Close</button>
                      </>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Book Tab Content - Calendar + Classes by Date
  const BookTab = ({ 
    bookings, setBookings, 
    bookingView, setBookingView, 
    lastBookedClass, setLastBookedClass,
    selectedBookingClass, setSelectedBookingClass,
    selectedDate, setSelectedDate,
    bookingCalendarStart,
    recurringPattern, dateOverrides, getClassesForDate
  }) => {
    const [selectedInstructor, setSelectedInstructor] = useState('all');

    // Class descriptions
    const classDescriptions = {
      'Pilates Reformer': 'Challenge your body with our dynamic reformer pilates classes. Using state-of-the-art equipment, build strength, flexibility, and endurance while improving posture and alignment.',
      'Pilates Mat': 'Master core strength through controlled movements on the mat. Perfect for all levels, this class focuses on building a strong foundation and improving body awareness.',
      'Core Strength': 'Intensive core training designed to strengthen your abdominal muscles and deep stabilizers. Expect a challenging workout that builds power and stability.',
      'Advanced Pilates': 'For experienced practitioners, this advanced class combines complex movements with intense focus on precision and control.',
      'Pelvic Curl Flow': 'Gentle flowing movements that engage the pelvic floor and core. Created with expertise to enhance mobility and strength in these crucial areas.',
      'Deep Core Activation': 'Activate and strengthen your deepest core muscles through targeted exercises and mindful breathing techniques.',
      'Advanced Pelvic Techniques': 'Advanced training for pelvic floor strength and control, designed for those with prior experience.',
      'Pilates Fusion': 'Combines pilates with elements of dance and yoga for a dynamic full-body workout that\'s both challenging and enjoyable.',
      'Ice Skating with Grace': 'Learn the fundamentals of ice skating with an emphasis on grace, balance, and control on the ice.',
      'Speed Skating': 'High-intensity ice skating focused on speed, agility, and power development for intermediate to advanced skaters.',
      'Ice Skating Techniques': 'Master advanced ice skating techniques including jumps, spins, and transitions with professional instruction.',
      'Crossfit on Ice': 'Combine crossfit intensity with ice skating challenges for a unique full-body workout experience.',
    };

    // Class schedule by date (mapping dates to classes)
    // Sunday (2026-03-08) - NO CLASSES (Rest day)
    // Monday (2026-03-09) - has classes
    // Tuesday (2026-03-10) - has classes  
    // etc.
    // NOTE: classSchedule is now passed as a prop from parent component

    const instructors = {
      nicolas: { name: 'Nicolas', title: 'Pilates Specialist', rating: 4.9, reviews: 127, bio: 'Pilates and Pushups', photo: 'https://i.ibb.co/xKGQ2P8B/Nicolas-Boitout.png' },
      angelina: { name: 'Angelina', title: 'Pilates Master', rating: 5.0, reviews: 48, bio: 'Pelvic Curl Goddess', photo: 'https://i.ibb.co/8g8sMgRj/Angelina-Tricolici.png' },
      sergey: { name: 'Sergey', title: 'Crossfit Coach', rating: 4.8, reviews: 95, bio: 'Siberian Crossfitter', photo: 'https://i.ibb.co/nNGSPCsY/Sergey.png' },
    };

    // Generate 7 days starting from bookingCalendarStart (not selectedDate)
    // Calendar is RECURRING - same schedule repeats every week (Mon-Sun pattern)
    const getDayDates = () => {
      const dates = [];
      const startDate = bookingCalendarStart || new Date();
      for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        dates.push(d);
      }
      return dates;
    };

    const dayDates = getDayDates();

    // Format date for display
    const formatDate = (date) => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[date.getDay()];
    };

    // Get instructor data
    const getInstructorData = (instructorName) => {
      const key = instructorName.toLowerCase();
      return instructors[key] || null;
    };

    // Format date for class detail view
    const formatDateDetail = (date) => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return `${days[date.getDay()]}, ${date.getDate()} Mar`;
    };

    // Check if session is in the past
    const isSessionInPast = () => {
      const now = new Date();
      const sessionDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedBookingClass.time.split(':').map(Number);
      sessionDateTime.setHours(hours, minutes, 0, 0);
      return sessionDateTime <= now;
    };

    // Handle booking confirmation
    const handleBooking = () => {
      // Check if session is in the past and user hasn't confirmed yet
      if (isSessionInPast() && bookingView !== 'warning') {
        setBookingView('warning');
        return;
      }

      // Create booking object
      const newBooking = {
        id: Date.now(),
        className: selectedBookingClass.name,
        instructor: selectedBookingClass.instructor,
        time: selectedBookingClass.time,
        duration: selectedBookingClass.duration,
        displayDate: formatDateDetail(selectedDate),
        dateObj: new Date(selectedDate),
        classId: selectedBookingClass.id,
      };

      // Add time to dateObj for accurate sorting
      const [hours, minutes] = selectedBookingClass.time.split(':').map(Number);
      newBooking.dateObj.setHours(hours, minutes, 0, 0);

      // Add to bookings array
      const updatedBookings = [...bookings, newBooking];

      // Sort by date/time (closest first)
      updatedBookings.sort((a, b) => a.dateObj - b.dateObj);

      // Save to state
      setBookings(updatedBookings);

      // Save to localStorage
      localStorage.setItem('arikanaBookings', JSON.stringify(updatedBookings));

      // Show confirmation page
      setLastBookedClass(newBooking);
      setSelectedBookingClass(null);
      setBookingView('confirmation');
    };

    // CONFIRMATION PAGE - shown when bookingView === 'confirmation'
    if (bookingView === 'confirmation' && lastBookedClass) {
      console.log('🟢 CONFIRMATION PAGE RENDERING', { class: lastBookedClass.className });
      return (
        <div className="pb-28 flex flex-col bg-white">
          {/* Header */}
          <div style={{ backgroundColor: ARIKANA_COLOR }} className="text-white px-6 py-3">
            <h1 className="text-lg font-light text-center">Booking Confirmation</h1>
          </div>

          {/* Content */}
          <div className="px-6 py-4 flex flex-col items-center">
            {/* Success Icon */}
            <div className="text-5xl mb-3">✅</div>
            
            {/* Success Message */}
            <h2 className="text-xl font-bold text-stone-900 mb-1">You're Booked!</h2>
            <p className="text-sm text-stone-600 mb-6">Your spot is confirmed. See you soon!</p>

            {/* Booking Details - 2 Column Grid */}
            <div className="w-full bg-stone-100 rounded-2xl p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Class */}
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-widest font-bold mb-2">Class</p>
                  <p className="text-sm font-bold text-stone-900">{lastBookedClass.className}</p>
                </div>
                
                {/* Instructor */}
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-widest font-bold mb-2">Instructor</p>
                  <p className="text-sm font-bold text-stone-900">{lastBookedClass.instructor}</p>
                </div>

                {/* Date & Time */}
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-widest font-bold mb-2">Date & Time</p>
                  <p className="text-sm text-stone-900 font-semibold">{lastBookedClass.displayDate}</p>
                  <p className="text-sm font-bold text-stone-900">{lastBookedClass.time}</p>
                </div>

                {/* Duration */}
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-widest font-bold mb-2">Duration</p>
                  <p className="text-sm font-bold text-stone-900">{lastBookedClass.duration}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="px-6 pb-4 mt-auto">
            <button
              style={{ backgroundColor: ARIKANA_COLOR }}
              className="w-full text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity text-base"
              onClick={() => {
                setBookingView('classes');
                setSelectedBookingClass(null);
                setLastBookedClass(null);
              }}
            >
              Back to Booking Calendar
            </button>
          </div>
        </div>
      );
    }
    
    // WARNING PAGE - shown when bookingView === 'warning'
    if (bookingView === 'warning' && selectedBookingClass) {
      return (
        <div className="pb-28">
          {/* Header */}
          <div style={{ backgroundColor: ARIKANA_COLOR }} className="text-white px-6 py-4 flex justify-between items-center">
            <button onClick={() => { setBookingView('detail'); }} className="text-2xl">←</button>
            <h1 className="text-lg font-light flex-1 text-center">Warning</h1>
            <div className="w-8"></div>
          </div>

          {/* Warning Content */}
          <div className="px-6 py-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">Session in the Past</h2>
              <p className="text-stone-600 text-base">This class has already started or passed.</p>
            </div>

            {/* Session Details */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 mb-6">
              <p className="text-sm font-semibold text-stone-900 mb-2">{selectedBookingClass.name}</p>
              <p className="text-xs text-stone-600">{formatDateDetail(selectedDate)} • {selectedBookingClass.time}</p>
              <p className="text-xs text-stone-500 mt-2">with {selectedBookingClass.instructor}</p>
            </div>

            {/* Warning Message */}
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-8">
              <p className="text-sm text-amber-900">You can still book this session if you'd like to add it to your history, but it won't appear in your upcoming bookings.</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-6 pb-4 flex gap-3">
            <button 
              style={{ borderColor: ARIKANA_COLOR, color: ARIKANA_COLOR }}
              className="flex-1 border-2 py-3 rounded-lg font-semibold hover:opacity-80 transition-opacity"
              onClick={() => {
                setBookingView('classes');
                setSelectedBookingClass(null);
              }}
            >
              Cancel
            </button>
            <button 
              style={{ backgroundColor: ARIKANA_COLOR }}
              className="flex-1 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              onClick={handleBooking}
            >
              Book Anyway
            </button>
          </div>
        </div>
      );
    }

    // BOOKING DETAIL VIEW - shown when bookingView === 'detail'
    if (bookingView === 'detail' && selectedBookingClass) {
      const instructor = getInstructorData(selectedBookingClass.instructor);
      const description = classDescriptions[selectedBookingClass.name] || 'Professional class instruction.';
      const sessionInPast = isSessionInPast();

      return (
        <div className="pb-28">
          {/* Header */}
          <div style={{ backgroundColor: ARIKANA_COLOR }} className="text-white px-6 py-4 flex justify-between items-center">
            <button onClick={() => setBookingView('classes')} className="text-2xl">←</button>
            <h1 className="text-lg font-light flex-1 text-center">Book Class</h1>
            <button className="text-2xl">⬆️</button>
          </div>

          {/* Class Details */}
          <div className="px-6 py-6">
            {/* Class Title */}
            <h2 className="text-2xl font-bold text-stone-900 mb-2">{selectedBookingClass.name}</h2>

            {/* Date and Time */}
            <p className="text-stone-600 text-base mb-6">
              {formatDateDetail(selectedDate)} • {selectedBookingClass.time} ({selectedBookingClass.duration})
            </p>

            {/* Past Session Warning Badge */}
            {sessionInPast && (
              <div className="bg-orange-100 border-l-4 border-orange-500 p-3 mb-6 rounded">
                <p className="text-orange-800 text-sm font-semibold">⚠️ This session is in the past</p>
              </div>
            )}

            {/* Staff Section */}
            <div className="mb-8">
              <p className="text-xs text-stone-500 uppercase tracking-wide mb-3">Staff</p>
              <div className="flex items-center gap-3">
                <img 
                  src={instructor?.photo} 
                  alt={selectedBookingClass.instructor}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <h3 className="text-xl font-semibold text-stone-900">{selectedBookingClass.instructor}</h3>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-xs text-stone-500 uppercase tracking-wide mb-3">Description</p>
              <p className="text-base text-stone-700 leading-relaxed mb-2">{description}</p>
              <button className="text-base font-semibold text-stone-900 underline">Read more</button>
            </div>
          </div>

          {/* Buttons */}
          <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-6 pb-4 flex gap-3">
            <button 
              style={{ borderColor: ARIKANA_COLOR, color: ARIKANA_COLOR }}
              className="flex-1 border-2 py-3 rounded-lg font-semibold text-stone-600 opacity-50 cursor-not-allowed"
              disabled
            >
              Book Multiple
            </button>
            <button 
              style={{ backgroundColor: ARIKANA_COLOR }}
              className="flex-1 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              onClick={handleBooking}
            >
              Book
            </button>
          </div>
        </div>
      );
    }

    // Classes List View - Default
    return (
      <div className="pb-28">
        {/* Header */}
        <div style={{ backgroundColor: ARIKANA_COLOR }} className="text-white px-6 py-4">
          <h1 className="text-xl font-light">Book Classes</h1>
        </div>

        {/* Calendar Day Picker */}
        <div className="px-4 py-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2" style={{ minWidth: 'min-content' }}>
            {dayDates.map((date, idx) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(date)}
                  style={{
                    backgroundColor: isSelected ? ARIKANA_COLOR : '#f5f5f5',
                    color: isSelected ? '#fff' : '#333',
                    borderColor: isSelected ? ARIKANA_COLOR : '#ddd'
                  }}
                  className="flex-shrink-0 w-14 h-14 rounded-full flex flex-col items-center justify-center border-2 transition-all text-xs font-semibold"
                >
                  <span className="text-sm">{date.getDate()}</span>
                  <span className="text-xs opacity-80">{formatDate(date)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Swipeable Instructor Cards */}
        <div className="overflow-x-auto scrollbar-hide px-4 py-2">
          <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
            {/* All Instructors Card */}
            <button
              onClick={() => setSelectedInstructor('all')}
              style={{
                backgroundColor: selectedInstructor === 'all' ? ARIKANA_COLOR : '#f5f5f5',
                color: selectedInstructor === 'all' ? '#fff' : '#333'
              }}
              className="flex-shrink-0 w-48 rounded-2xl p-2 text-left transition-all hover:shadow-lg cursor-pointer flex items-center gap-2"
            >
              <div className="text-2xl">🎯</div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold">All</h3>
                <p className="text-xs opacity-80">Instructors</p>
              </div>
            </button>

            {/* Individual Instructor Cards */}
            {['nicolas', 'angelina', 'sergey'].map((key) => {
              const instr = instructors[key];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedInstructor(key)}
                  style={{
                    backgroundColor: selectedInstructor === key ? ARIKANA_COLOR : '#f5f5f5',
                    color: selectedInstructor === key ? '#fff' : '#333'
                  }}
                  className="flex-shrink-0 w-56 rounded-2xl p-3 text-left transition-all hover:shadow-lg cursor-pointer overflow-hidden"
                >
                  <div className="flex gap-2 h-20">
                    {/* Left: Photo + Name */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-white mb-1 overflow-hidden border-2" style={{ borderColor: selectedInstructor === key ? '#fff' : ARIKANA_COLOR }}>
                        <img src={instr.photo} alt={instr.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-xs font-bold text-center">{instr.name}</h3>
                    </div>

                    {/* Right: Title and Bio */}
                    <div className="flex flex-col justify-start flex-1 min-w-0 gap-0.5">
                      <p className="text-xs opacity-80">{instr.title}</p>
                      <p className="text-xs opacity-70">{instr.bio}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Display + Classes */}
        <div className="px-6 py-3 pb-4">
          <h3 className="text-sm font-bold text-stone-900 mb-3">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>

          {/* Get classes for this date using recurring pattern */}
          {(() => {
            const classesForDay = getClassesForDate(selectedDate);
            const filteredClasses = (selectedInstructor === 'all' 
              ? classesForDay 
              : classesForDay.filter(c => c.instructor.toLowerCase() === selectedInstructor))
              .sort((a, b) => a.time.localeCompare(b.time)); // Sort by start time
            
            return selectedDate.getDay() === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">😌</div>
              <p className="text-lg font-semibold text-stone-900 mb-2">Rest Day</p>
              <p className="text-sm text-stone-600">Take a break, recharge, and come back stronger tomorrow!</p>
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-500 text-sm">No classes available for this day</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredClasses.map((cls) => (
                <div key={cls.id} className="bg-white border border-stone-200 rounded-lg p-3 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-semibold text-stone-900 text-xs">{cls.name}</h4>
                      <p className="text-xs text-stone-600 mt-1">with {cls.instructor}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 text-xs text-stone-600 mb-2">
                    <span>⏱️ {cls.time} • {cls.duration}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBookingClass(cls);
                      setBookingView('detail');
                    }}
                    style={{ 
                      borderColor: ARIKANA_COLOR,
                      color: ARIKANA_COLOR
                    }}
                    className="w-full border-2 text-white font-semibold py-1.5 rounded-lg transition-all hover:opacity-80 text-xs"
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = ARIKANA_COLOR;
                      e.target.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = ARIKANA_COLOR;
                    }}
                  >
                    Book Now →
                  </button>
                </div>
              ))}
            </div>
          );
          })()}
        </div>
      </div>
    );
  };

  // Buy Tab Content
  const BuyTab = () => {
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectedAutopay, setSelectedAutopay] = useState(null);
    const [selectedCheckout, setSelectedCheckout] = useState(null);

    const autopays = [
      { name: 'Arikana Commitment M&F', sessions: '9 sessions ☆', price: '245 RON', id: 'autopay-9', checkoutName: 'Mat&Floor Classes - 9 sessions', checkoutPrice: '290 RON' },
      { name: 'Arikana Commitment M&F', sessions: '16 sessions ☆', price: '295 RON', id: 'autopay-16', checkoutName: 'Mat&Floor Classes - 16 sessions', checkoutPrice: '350 RON' },
      { name: 'Arikana Commitment M&F 1 month', sessions: 'unlimited ☆', price: '395 RON', id: 'autopay-unlimited', checkoutName: 'Mat&Floor Classes 1 month - Unlimited', checkoutPrice: '450 RON' },
    ];

    const pricing = [
      { name: 'Mat&Floor - 1 session', price: '120 RON', id: 'pricing-1' },
      { name: 'Mat&Floor Classes - 9 sessions', price: '290 RON', id: 'pricing-9' },
      { name: 'Mat&Floor Classes - 16 sessions', price: '350 RON', id: 'pricing-16' },
      { name: 'Mat&Floor Classes 1 month - Unlimited', price: '450 RON', id: 'pricing-unlimited' },
    ];

    // Checkout Page
    if (selectedCheckout) {
      const checkoutData = {
        'autopay-9': { name: 'Mat&Floor Classes - 9 sessions', price: '290 RON' },
        'autopay-16': { name: 'Mat&Floor Classes - 16 sessions', price: '350 RON' },
        'autopay-unlimited': { name: 'Mat&Floor Classes 1 month - Unlimited', price: '450 RON' },
        'pricing-1': { name: 'Mat&Floor - 1 session', price: '120 RON' },
        'pricing-9': { name: 'Mat&Floor Classes - 9 sessions', price: '290 RON' },
        'pricing-16': { name: 'Mat&Floor Classes - 16 sessions', price: '350 RON' },
        'pricing-unlimited': { name: 'Mat&Floor Classes 1 month - Unlimited', price: '450 RON' },
      };

      const data = checkoutData[selectedCheckout];
      const priceValue = parseInt(data.price.split(' ')[0]);

      return (
        <div className="pb-28">
          {/* Header */}
          <div style={{ backgroundColor: ARIKANA_COLOR }} className="text-white px-6 py-4 flex items-center justify-between rounded-b-3xl">
            <button onClick={() => setSelectedCheckout(null)} className="text-3xl font-light">×</button>
            <h1 className="text-2xl font-light">Checkout</h1>
            <div className="w-8"></div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Product Name */}
            <div className="bg-stone-100 rounded-lg p-4 mb-6">
              <h2 className="text-xl font-semibold text-stone-900">{data.name}</h2>
            </div>

            {/* Promo Code */}
            <button className="w-full flex items-center gap-3 py-4 border-b border-stone-200 hover:bg-stone-50 transition-colors">
              <span style={{ color: ARIKANA_COLOR }} className="text-2xl">⊕</span>
              <span className="font-semibold text-stone-900 text-lg">Promo code</span>
            </button>

            {/* Gift Card */}
            <button className="w-full flex items-center gap-3 py-4 border-b border-stone-200 hover:bg-stone-50 transition-colors">
              <span style={{ color: ARIKANA_COLOR }} className="text-2xl">⊕</span>
              <span className="font-semibold text-stone-900 text-lg">Gift card</span>
            </button>

            {/* Payment Method */}
            <div className="py-6 border-b border-stone-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-black rounded flex items-center justify-center">
                    <span className="text-red-500 font-bold text-sm">●●</span>
                  </div>
                  <span className="font-semibold text-stone-900">••••• 9909</span>
                </div>
                <button style={{ color: ARIKANA_COLOR }} className="font-semibold hover:opacity-80 transition-opacity">
                  Change
                </button>
              </div>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between py-4 border-b-2 border-stone-300 mb-4">
              <span className="text-stone-900 font-semibold">Subtotal</span>
              <span className="text-stone-900 font-semibold">{data.price}</span>
            </div>

            {/* Today's Total */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-stone-900 font-bold text-lg">Today's Total</span>
                <span className="text-stone-900 font-bold text-lg">{data.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Tax is included</span>
                <span className="text-stone-600">0 RON</span>
              </div>
            </div>

            {/* Info Message */}
            <div className="text-center text-stone-600 mb-8 py-8">
              <p>You will be charged Today's Total when you tap Buy</p>
            </div>
          </div>

          {/* Buy Button */}
          <div className="fixed bottom-6 left-0 right-0 max-w-md mx-auto px-6">
            <button
              style={{ backgroundColor: ARIKANA_COLOR }}
              className="w-full text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity text-lg"
            >
              Buy
            </button>
          </div>
        </div>
      );
    }

    // Autopay Detail View
    if (selectedAutopay) {
      const autopayData = {
        'autopay-9': {
          title: 'Arikana Commitment M&F 9 sessions ☆',
          itemName: 'Arikana Commitment M&F 9 sessions ☆',
          classesName: 'Mat&Floor Classes - 9 sessions',
          recurringAmount: '245 RON',
          dueFrequency: 'every 4 weeks',
          duration: '396 weeks',
          todaysTotal: '290 RON'
        },
        'autopay-16': {
          title: 'Arikana Commitment M&F 16 sessions ☆',
          itemName: 'Arikana Commitment M&F 16 sessions ☆',
          classesName: 'Mat&Floor Classes - 16 sessions',
          recurringAmount: '295 RON',
          dueFrequency: 'every 4 weeks',
          duration: '396 weeks',
          todaysTotal: '340 RON'
        },
        'autopay-unlimited': {
          title: 'Arikana Commitment M&F 1 month - unlimited ☆',
          itemName: 'Arikana Commitment M&F 1 month - unlimited ☆',
          classesName: 'Mat&Floor Classes 1 month - Unlimited',
          recurringAmount: '395 RON',
          dueFrequency: 'every 4 weeks',
          duration: '396 weeks',
          todaysTotal: '440 RON'
        }
      };

      const data = autopayData[selectedAutopay];

      return (
        <div className="pb-28">
          {/* Header */}
          <div style={{ backgroundColor: ARIKANA_COLOR }} className="text-white px-6 py-4 flex items-center justify-between rounded-b-3xl">
            <button onClick={() => setSelectedAutopay(null)} className="text-3xl font-light">×</button>
            <h1 className="text-lg font-light flex-1 text-center">{data.title}</h1>
            <div className="w-8"></div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Title */}
            <h2 className="text-lg font-light text-stone-600 mb-6">{data.itemName}</h2>

            {/* Items Section */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wide mb-4 pb-2 border-b border-stone-200">Items</h3>
              <div className="space-y-4">
                <div className="pb-4 border-b border-stone-200">
                  <p className="font-semibold text-stone-900">{data.itemName}</p>
                  <p className="text-sm text-stone-600">Enrollment Fee</p>
                  <p className="text-xs text-stone-500">One time</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-900">{data.classesName}</p>
                  <p className="text-sm text-stone-600">Recurring</p>
                </div>
              </div>
            </div>

            {/* Payment Schedule Section */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wide mb-4 pb-2 border-b border-stone-200">Payment Schedule</h3>
              <div className="space-y-3 mb-6">
                <p className="font-semibold text-stone-900">Contract starts Mar 10, 2026</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-stone-600">Recurring amount</span>
                  <span className="font-semibold text-stone-900">{data.recurringAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Due</span>
                  <span className="font-semibold text-stone-900">{data.dueFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Duration</span>
                  <span className="font-semibold text-stone-900">{data.duration}</span>
                </div>
              </div>
            </div>

            {/* Today's Total */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="text-stone-900 font-semibold">Today's Total</span>
                <div style={{ color: ARIKANA_COLOR }} className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs">ⓘ</div>
              </div>
              <span style={{ color: ARIKANA_COLOR }} className="text-2xl font-bold">{data.todaysTotal}</span>
            </div>
          </div>

          {/* Next Button */}
          <div className="fixed bottom-6 left-0 right-0 max-w-md mx-auto px-6">
            <button
              onClick={() => setSelectedCheckout(selectedAutopay)}
              style={{ backgroundColor: ARIKANA_COLOR }}
              className="w-full text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity text-lg"
            >
              Next
            </button>
          </div>
        </div>
      );
    }

    // Mat & Floor Classes Detail
    if (selectedPackage === 'mat-floor') {
      return (
        <div className="pb-28">
          {/* Header */}
          <div style={{ backgroundColor: ARIKANA_COLOR }} className="text-white px-6 py-4 flex items-center gap-3">
            <button onClick={() => setSelectedPackage(null)} className="text-2xl">←</button>
            <h1 className="text-2xl font-light">Mat & Floor Classes</h1>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Autopays Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Autopays</h2>
              <div className="space-y-4">
                {autopays.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedAutopay(item.id)}
                    className="w-full text-left border-b border-stone-200 pb-4 hover:opacity-80 transition-opacity"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-stone-900">{item.name}</p>
                        <p className="text-sm text-stone-600">{item.sessions}</p>
                        <p className="text-xs text-stone-500 mt-1">Autopay</p>
                      </div>
                      <p className="font-bold text-stone-900">{item.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Options Section */}
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Pricing Options</h2>
              <div className="space-y-4">
                {pricing.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCheckout(item.id)}
                    className="w-full text-left border-b border-stone-200 pb-4 hover:opacity-80 transition-opacity"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-stone-900">{item.name}</p>
                      <p className="font-bold text-stone-900">{item.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Main Buy Tab
    return (
      <div className="pb-28">
        <div style={{ background: `linear-gradient(to bottom, ${ARIKANA_COLOR}, ${ARIKANA_COLOR}cc)` }} className="text-white px-6 py-8 rounded-b-3xl">
          <h1 className="text-2xl font-light">Memberships & Packages</h1>
        </div>

        <div className="px-6 mt-8">
          <div className="space-y-4">
            {[
              { name: 'Mat & Floor Classes', price: null, desc: null, id: 'mat-floor' },
              { name: '8-Class Pack', price: '$149', desc: 'Valid for 3 months', id: '8-pack' },
              { name: '4-Class Pack', price: '$89', desc: 'Valid for 3 months', id: '4-pack' },
              { name: 'Private Session', price: '$120', desc: 'One-on-one coaching', id: 'private' },
            ].map((pkg, i) => (
              <div key={i} className="border border-stone-200 rounded-2xl p-4 hover:border-stone-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-stone-900">{pkg.name}</h3>
                  {pkg.price && <span style={{ color: ARIKANA_COLOR }} className="font-bold">{pkg.price}</span>}
                </div>
                {pkg.desc && <p className="text-sm text-stone-600 mb-3">{pkg.desc}</p>}
                <button 
                  onClick={() => setSelectedPackage(pkg.id)}
                  style={{ borderColor: ARIKANA_COLOR, color: ARIKANA_COLOR }} 
                  className="w-full border-2 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity text-sm"
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Profile Tab Content
  const ProfileTab = ({ recurringPattern, setRecurringPattern, dateOverrides, setDateOverrides, getClassesForDate, currentUser, setCurrentUser }) => {
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [editingClass, setEditingClass] = useState(null);
    const [editingDayNum, setEditingDayNum] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newClassForm, setNewClassForm] = useState({ name: '', time: '', duration: '60 min', instructor: 'Nicolas', spots: 10, dayOfWeek: 1, recurringEveryWeek: true });

    // Generate 7 days starting from TODAY
    const getTodayPlus7Days = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const days = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        days.push({ dateStr, date, dayOfWeek: date.getDay() });
      }
      return days;
    };

    const sevenDaysFromToday = getTodayPlus7Days();
    
    // Add state for tracking which date/edit mode we're in
    const [editingDateStr, setEditingDateStr] = useState(null);
    const [editMode, setEditMode] = useState(null); // 'dateOnly' or 'recurring'

    const paymentMethods = [
      { type: 'Mastercard', last4: '9909', expires: '09/2029' },
    ];

    const purchaseHistory = [
      { name: 'M&F Classes - 1 Month', price: '295 RON', date: 'Purchased 20.01.2026' },
      { name: 'M&F Classes - 1 Month', price: '295 RON', date: 'Purchased 20.01.2026' },
    ];

    const handleSignOut = () => {
      localStorage.removeItem('arikanaUser');
      setCurrentUser(null);
    };

    // Create New Class Form - show this with HIGH PRIORITY
    if (showCreateForm) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      return (
        <div className="pb-28">
          {/* Header */}
          <div style={{ background: `linear-gradient(to bottom, ${ARIKANA_COLOR}, ${ARIKANA_COLOR}cc)` }} className="text-white px-6 py-4">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setShowCreateForm(false)} className="text-2xl cursor-pointer">←</button>
              <h1 className="text-2xl font-light flex-1">Create New Class</h1>
            </div>
          </div>

          {/* Create Form */}
          <div className="px-6 py-6">
            <div className="space-y-4">
              {/* Class Name */}
              <div>
                <label className="text-sm font-semibold text-stone-900 block mb-2">Class Name</label>
                <input
                  type="text"
                  value={newClassForm.name || ''}
                  onChange={(e) => setNewClassForm({ ...newClassForm, name: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  placeholder="e.g., Pilates Mat"
                />
              </div>

              {/* Day of Week */}
              <div>
                <label className="text-sm font-semibold text-stone-900 block mb-2">Day of Week</label>
                <select
                  value={newClassForm.dayOfWeek}
                  onChange={(e) => setNewClassForm({ ...newClassForm, dayOfWeek: parseInt(e.target.value) })}
                  className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                >
                  {dayNames.map((day, idx) => (
                    <option key={idx} value={idx}>{day}</option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div>
                <label className="text-sm font-semibold text-stone-900 block mb-2">Start Time</label>
                <input
                  type="time"
                  value={newClassForm.time || ''}
                  onChange={(e) => setNewClassForm({ ...newClassForm, time: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm font-semibold text-stone-900 block mb-2">Duration</label>
                <input
                  type="text"
                  value={newClassForm.duration || ''}
                  onChange={(e) => setNewClassForm({ ...newClassForm, duration: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  placeholder="e.g., 60 min"
                />
              </div>

              {/* Instructor */}
              <div>
                <label className="text-sm font-semibold text-stone-900 block mb-2">Instructor</label>
                <select
                  value={newClassForm.instructor || ''}
                  onChange={(e) => setNewClassForm({ ...newClassForm, instructor: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                >
                  <option value="Nicolas">Nicolas</option>
                  <option value="Angelina">Angelina</option>
                  <option value="Sergey">Sergey</option>
                </select>
              </div>

              {/* Available Spots */}
              <div>
                <label className="text-sm font-semibold text-stone-900 block mb-2">Available Spots</label>
                <input
                  type="number"
                  value={newClassForm.spots || 10}
                  onChange={(e) => setNewClassForm({ ...newClassForm, spots: parseInt(e.target.value) })}
                  className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>

              {/* Recurring Every Week */}
              <div>
                <label className="text-sm font-semibold text-stone-900 block mb-3">Schedule Type</label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newClassForm.recurringEveryWeek}
                    onChange={(e) => setNewClassForm({ ...newClassForm, recurringEveryWeek: e.target.checked })}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-stone-700">
                    {newClassForm.recurringEveryWeek ? '🔄 Recurring every week' : '📅 One-time class'}
                  </span>
                </label>
                <p className="text-xs text-stone-500 mt-2">
                  {newClassForm.recurringEveryWeek 
                    ? 'This class will repeat every week on the selected day' 
                    : 'This class will only appear on the specific date selected'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 text-stone-600 border-2 border-stone-300 py-3 rounded-lg font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newClassForm.name || !newClassForm.time) {
                    alert('Please fill in class name and time');
                    return;
                  }
                  
                  // Generate next unique ID across all classes
                  const allClasses = Object.values(recurringPattern).flat().concat(Object.values(dateOverrides).flat());
                  const newId = Math.max(...allClasses.map(c => c.id || 0), 0) + 1;
                  
                  const newClass = {
                    id: newId,
                    name: newClassForm.name,
                    time: newClassForm.time,
                    duration: newClassForm.duration,
                    instructor: newClassForm.instructor,
                    spots: newClassForm.spots,
                  };
                  
                  if (newClassForm.recurringEveryWeek) {
                    // Save to recurring pattern (for the selected day of week)
                    const updatedPattern = { ...recurringPattern };
                    if (!updatedPattern[newClassForm.dayOfWeek]) {
                      updatedPattern[newClassForm.dayOfWeek] = [];
                    }
                    updatedPattern[newClassForm.dayOfWeek].push(newClass);
                    setRecurringPattern(updatedPattern);
                  } else {
                    // Save to date overrides (one-time class)
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const specificDate = new Date(today);
                    specificDate.setDate(specificDate.getDate() + (newClassForm.dayOfWeek - today.getDay() + 7) % 7);
                    if (specificDate <= today) {
                      specificDate.setDate(specificDate.getDate() + 7);
                    }
                    const dateStr = specificDate.toISOString().split('T')[0];
                    
                    const updatedOverrides = { ...dateOverrides };
                    if (!updatedOverrides[dateStr]) {
                      updatedOverrides[dateStr] = [];
                    }
                    updatedOverrides[dateStr].push(newClass);
                    setDateOverrides(updatedOverrides);
                  }
                  
                  setShowCreateForm(false);
                  setNewClassForm({ name: '', time: '', duration: '60 min', instructor: 'Nicolas', spots: 10, dayOfWeek: 1, recurringEveryWeek: true });
                  alert('✓ Class created successfully!');
                }}
                style={{ backgroundColor: ARIKANA_COLOR }}
                className="flex-1 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                ✓ Create Class
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Edit Class Modal - only for Lead Trainer
    if (selectedMenuItem === 'calendar' && currentUser?.role === 'lead-trainer' && editingClass) {
      return (
        <div className="pb-28">
          {/* Header */}
          <div style={{ background: `linear-gradient(to bottom, ${ARIKANA_COLOR}, ${ARIKANA_COLOR}cc)` }} className="text-white px-6 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => { setEditingClass(null); setEditingDateStr(null); setEditMode(null); }} className="text-2xl">←</button>
              <h1 className="text-2xl font-light flex-1">Edit Class</h1>
            </div>
          </div>

          {/* Edit Form */}
          <div className="px-6 py-6">
            {/* Date Display */}
            {editingDateStr && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-xs text-blue-900 font-semibold">Date</p>
                <p className="text-sm text-blue-900 mt-1">
                  {new Date(editingDateStr + 'T00:00:00').toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            )}

            {/* Edit Mode Selection */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-stone-900 mb-3">Apply changes to:</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="editMode"
                    value="dateOnly"
                    checked={editMode === 'dateOnly'}
                    onChange={(e) => setEditMode(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-stone-900">This date only</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="editMode"
                    value="recurring"
                    checked={editMode === 'recurring'}
                    onChange={(e) => setEditMode(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-stone-900">Recurring pattern (every {new Date(editingDateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })})</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              {/* Class Name */}
              <div>
                <label className="text-sm font-semibold text-stone-900 block mb-2">Class Name</label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  placeholder="e.g., Pilates Mat"
                />
              </div>

              {/* Time */}
              <div>
                <label className="text-sm font-semibold text-stone-900 block mb-2">Start Time</label>
                <input
                  type="time"
                  value={editForm.time || ''}
                  onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm font-semibold text-stone-900 block mb-2">Duration</label>
                <input
                  type="text"
                  value={editForm.duration || ''}
                  onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  placeholder="e.g., 60 min"
                />
              </div>

              {/* Instructor */}
              <div>
                <label className="text-sm font-semibold text-stone-900 block mb-2">Instructor</label>
                <select
                  value={editForm.instructor || ''}
                  onChange={(e) => setEditForm({ ...editForm, instructor: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                >
                  <option value="">Select Instructor</option>
                  <option value="Nicolas">Nicolas</option>
                  <option value="Angelina">Angelina</option>
                  <option value="Sergey">Sergey</option>
                </select>
              </div>

              {/* Spots */}
              <div>
                <label className="text-sm font-semibold text-stone-900 block mb-2">Available Spots</label>
                <input
                  type="number"
                  value={editForm.spots || ''}
                  onChange={(e) => setEditForm({ ...editForm, spots: parseInt(e.target.value) })}
                  className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  placeholder="e.g., 10"
                  min="1"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    if (!editMode) {
                      alert('Please select: This date only or Recurring pattern');
                      return;
                    }
                    
                    if (editMode === 'dateOnly') {
                      // Delete from date override
                      const updatedOverrides = { ...dateOverrides };
                      if (!updatedOverrides[editingDateStr]) {
                        updatedOverrides[editingDateStr] = getClassesForDate(new Date(editingDateStr + 'T00:00:00'));
                      }
                      updatedOverrides[editingDateStr] = updatedOverrides[editingDateStr].filter((_, idx) => idx !== editingClass.index);
                      setDateOverrides(updatedOverrides);
                    } else {
                      // Delete from recurring pattern
                      const dayOfWeek = new Date(editingDateStr + 'T00:00:00').getDay();
                      const updatedPattern = { ...recurringPattern };
                      updatedPattern[dayOfWeek] = updatedPattern[dayOfWeek].filter((_, idx) => idx !== editingClass.index);
                      setRecurringPattern(updatedPattern);
                    }
                    
                    setEditingClass(null);
                    setEditingDateStr(null);
                    setEditMode(null);
                  }}
                  className="flex-1 text-red-600 border-2 border-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                >
                  🗑️ Delete Class
                </button>
                <button
                  onClick={() => {
                    setEditingClass(null);
                    setEditingDateStr(null);
                    setEditMode(null);
                  }}
                  className="flex-1 text-stone-600 border-2 border-stone-300 py-3 rounded-lg font-semibold hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!editMode) {
                      alert('Please select: This date only or Recurring pattern');
                      return;
                    }
                    
                    if (editMode === 'dateOnly') {
                      // Save to date override
                      const updatedOverrides = { ...dateOverrides };
                      if (!updatedOverrides[editingDateStr]) {
                        updatedOverrides[editingDateStr] = getClassesForDate(new Date(editingDateStr + 'T00:00:00'));
                      }
                      updatedOverrides[editingDateStr] = updatedOverrides[editingDateStr].map((cls, idx) => 
                        idx === editingClass.index ? { ...editForm, id: cls.id } : cls
                      );
                      setDateOverrides(updatedOverrides);
                    } else {
                      // Save to recurring pattern
                      const dayOfWeek = new Date(editingDateStr + 'T00:00:00').getDay();
                      const updatedPattern = { ...recurringPattern };
                      updatedPattern[dayOfWeek] = updatedPattern[dayOfWeek].map((cls, idx) => 
                        idx === editingClass.index ? { ...editForm, id: cls.id } : cls
                      );
                      setRecurringPattern(updatedPattern);
                    }
                    
                    setEditingClass(null);
                    setEditingDateStr(null);
                    setEditMode(null);
                  }}
                  style={{ backgroundColor: ARIKANA_COLOR }}
                  className="flex-1 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  ✓ Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Calendar Editor View - only for Lead Trainer  
    if (selectedMenuItem === 'calendar' && currentUser?.role === 'lead-trainer') {
      // Helper to format date for display
      const formatDateLabel = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
      };

      // Group classes by time for a specific date
      const getClassesByTime = (date) => {
        const classes = getClassesForDate(date);
        const timeGroups = {};
        
        classes.forEach((cls, idx) => {
          if (!timeGroups[cls.time]) {
            timeGroups[cls.time] = [];
          }
          timeGroups[cls.time].push({ ...cls, classIndex: idx });
        });
        
        return Object.entries(timeGroups)
          .sort(([timeA], [timeB]) => timeA.localeCompare(timeB))
          .map(([time, classList]) => ({ time, classList }));
      };

      return (
        <div className="pb-28">
          {/* Header */}
          <div style={{ background: `linear-gradient(to bottom, ${ARIKANA_COLOR}, ${ARIKANA_COLOR}cc)` }} className="text-white px-6 py-4">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setSelectedMenuItem(null)} className="text-2xl cursor-pointer">←</button>
              <h1 className="text-2xl font-light flex-1">Weekly Schedule</h1>
            </div>
            <p className="text-xs text-yellow-100 mt-2">Starting from Today</p>
          </div>

          {/* Calendar Grid - 7 Days from TODAY */}
          <div className="px-2 py-6 overflow-x-auto scrollbar-hide">
            <div 
              className="grid gap-3" 
              style={{ 
                gridAutoColumns: 'minmax(320px, 1fr)',
                gridAutoFlow: 'column',
                minWidth: 'max-content'
              }}
            >
              {sevenDaysFromToday.map(({ dateStr, date, dayOfWeek }) => {
                const timeGroups = getClassesByTime(date);
                const isToday = dateStr === new Date().toISOString().split('T')[0];
                const isRestDay = dayOfWeek === 0;

                return (
                  <div
                    key={dateStr}
                    className={`border-2 rounded-xl overflow-hidden bg-white flex flex-col ${isToday ? 'border-amber-400 shadow-lg' : 'border-stone-200'}`}
                    style={{ minWidth: '320px', minHeight: '500px' }}
                  >
                    {/* Date Header */}
                    <div
                      style={{ backgroundColor: ARIKANA_COLOR }}
                      className="text-white px-4 py-3 text-center flex flex-col"
                    >
                      <p className="font-bold text-lg">{formatDateLabel(date)}</p>
                    </div>

                    {/* Classes Container */}
                    <div className="p-3 flex-1 overflow-y-auto">
                      {isRestDay ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12">
                          <p className="text-4xl mb-3">☀️</p>
                          <p className="text-sm font-semibold text-stone-900">Rest Day</p>
                          <p className="text-xs text-stone-500 mt-2">Recharge & Recover!</p>
                        </div>
                      ) : timeGroups.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-center py-12">
                          <p className="text-sm text-stone-500">No classes scheduled</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {timeGroups.map(({ time, classList }, timeIdx) => (
                            <div key={timeIdx}>
                              <p className="text-sm font-bold text-stone-700 px-2 mb-2">{time}</p>
                              <div className={`grid gap-2 ${classList.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                {classList.map((cls, clsIdx) => (
                                  <button
                                    type="button"
                                    key={clsIdx}
                                    onClick={() => {
                                      setEditingClass({ index: cls.classIndex });
                                      setEditingDateStr(dateStr);
                                      setEditForm({ ...cls });
                                      setEditMode(null); // Reset mode selection
                                    }}
                                    style={{ borderColor: ARIKANA_COLOR, backgroundColor: `${ARIKANA_COLOR}10` }}
                                    className="border-l-4 rounded px-2.5 py-2 text-left hover:bg-amber-100 transition-colors cursor-pointer text-sm"
                                  >
                                    <p className="font-semibold text-stone-900 leading-snug">{cls.name}</p>
                                    <p className="text-xs text-stone-600 leading-snug">{cls.instructor}</p>
                                    <p className="text-xs text-stone-500 leading-snug">{cls.duration}</p>
                                    <p className="text-xs text-stone-400 mt-1 italic">tap to edit</p>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Create New Class Button */}
          <div className="px-6 mt-6 pb-6">
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              style={{ backgroundColor: ARIKANA_COLOR }}
              className="w-full text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              + Create New Class
            </button>
          </div>
        </div>
      );
    }


    // Payment Methods Detail View
    if (selectedMenuItem === 'payment-methods') {
      return (
        <div className="pb-28">
          {/* Header */}
          <div style={{ background: `linear-gradient(to bottom, ${ARIKANA_COLOR}, ${ARIKANA_COLOR}cc)` }} className="text-white px-6 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedMenuItem(null)} className="text-2xl">←</button>
              <h1 className="text-2xl font-light flex-1">Payment Methods</h1>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Payment Methods */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-stone-900 mb-4">Payment Methods</h3>
              <div className="space-y-4">
                {paymentMethods.map((card, i) => (
                  <div key={i} className="flex items-center justify-between bg-white border border-stone-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
                        <span className="text-red-500 font-bold">●●</span>
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">{card.type}</p>
                        <p className="text-sm text-stone-600">•••• •••• •••• {card.last4}</p>
                        <p className="text-xs text-stone-500">Expires {card.expires}</p>
                      </div>
                    </div>
                    <button className="text-stone-400 hover:text-red-600 transition-colors">🗑️</button>
                  </div>
                ))}
              </div>

              <button
                style={{ backgroundColor: ARIKANA_COLOR }}
                className="w-full text-white font-medium py-3 rounded-lg mt-4 hover:opacity-90 transition-opacity"
              >
                Add a Card
              </button>
            </div>

            {/* Purchase History */}
            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-4">Purchase History</h3>
              <div className="space-y-4">
                {purchaseHistory.map((item, i) => (
                  <div key={i} className="border-b border-stone-200 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-stone-900">{item.name}</p>
                        <p className="text-sm text-stone-500">{item.date}</p>
                      </div>
                      <p className="font-bold text-stone-900">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Main Profile Menu View
    return (
      <div className="pb-28">
        <div style={{ background: `linear-gradient(to bottom, ${ARIKANA_COLOR}, ${ARIKANA_COLOR}cc)` }} className="text-white px-6 py-8 rounded-b-3xl">
          <h1 className="text-2xl font-light">My Profile</h1>
        </div>

        <div className="px-6 mt-8">
          {/* User Card */}
          <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 mb-6 text-center">
            <div style={{ backgroundColor: `${ARIKANA_COLOR}20` }} className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
              <User style={{ color: ARIKANA_COLOR }} className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">{currentUser.firstName} {currentUser.lastName}</h2>
            {currentUser.role === 'lead-trainer' ? (
              <p style={{ color: ARIKANA_COLOR }} className="text-sm font-semibold mt-1">🌟 Lead Trainer</p>
            ) : (
              <p className="text-sm text-stone-600 mt-1">Active Member</p>
            )}
            <p className="text-xs text-stone-500 mt-2">{currentUser.email}</p>
            <p className="text-xs text-stone-500">{currentUser.mobile}</p>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            {[
              ...(currentUser.role === 'lead-trainer' ? [{ label: 'Class Schedule', icon: '📋', id: 'calendar' }] : []),
              { label: 'Booking History', icon: '📅', id: 'bookings' },
              { label: 'Membership', icon: '🎫', id: 'membership' },
              { label: 'Payment Methods', icon: '💳', id: 'payment-methods' },
              { label: 'Notifications', icon: '🔔', id: 'notifications' },
              { label: 'Preferences', icon: '⚙️', id: 'preferences' },
              { label: 'Help & Support', icon: '❓', id: 'help' },
              { label: 'About Arikana', icon: 'ℹ️', id: 'about' },
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedMenuItem(item.id)}
                className="w-full text-left border border-stone-200 rounded-xl p-4 hover:bg-stone-50 transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium text-stone-900">{item.label}</span>
                </span>
                <ChevronRight className="w-5 h-5 text-stone-400" />
              </button>
            ))}
          </div>

          <button 
            onClick={() => {
              if (confirm('Clear all date-specific changes and restore full schedule? This cannot be undone.')) {
                localStorage.removeItem('arikanaDateOverrides');
                alert('Schedule reset! Reloading...');
                location.reload();
              }
            }}
            className="w-full font-medium py-3 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors mt-4"
          >
            🔄 Reset Schedule
          </button>

          <button 
            onClick={handleSignOut}
            style={{ color: ARIKANA_COLOR, borderColor: ARIKANA_COLOR }} 
            className="w-full font-medium py-3 border-2 rounded-xl hover:opacity-80 transition-opacity mt-2"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  };

  // More Tab Content
  const MoreTab = () => (
    <div className="pb-28">
      <div style={{ background: `linear-gradient(to bottom, ${ARIKANA_COLOR}, ${ARIKANA_COLOR}cc)` }} className="text-white px-6 py-8 rounded-b-3xl">
        <h1 className="text-2xl font-light">More</h1>
      </div>

      <div className="px-6 mt-8">
        <div className="space-y-2">
          {[
            { label: 'Contact Us', icon: '📧', color: 'bg-blue-100 text-blue-600' },
            { label: 'Class Cancellations', icon: '⛔', color: 'bg-red-100 text-red-600' },
            { label: 'Referral Program', icon: '🎁', color: 'bg-green-100 text-green-600' },
            { label: 'Reviews & Ratings', icon: '⭐', color: 'bg-yellow-100 text-yellow-600' },
            { label: 'Terms & Conditions', icon: '📋', color: 'bg-purple-100 text-purple-600' },
            { label: 'Privacy Policy', icon: '🔒', color: 'bg-gray-100 text-gray-600' },
          ].map((item, i) => (
            <button
              key={i}
              className="w-full text-left border border-stone-200 rounded-xl p-4 hover:shadow-md transition-shadow flex items-center justify-between"
            >
              <span className="flex items-center gap-3">
                <span className={`text-2xl w-10 h-10 flex items-center justify-center rounded-lg ${item.color}`}>
                  {item.icon}
                </span>
                <span className="font-medium text-stone-900">{item.label}</span>
              </span>
              <ChevronRight className="w-5 h-5 text-stone-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const tabContent = {
    home: <HomeTab bookings={bookings} setBookings={setBookings} healthData={healthData} setHealthData={setHealthData} firebaseTestResult={firebaseTestResult} setFirebaseTestResult={setFirebaseTestResult} />,
    book: <BookTab 
      bookings={bookings}
      setBookings={setBookings}
      bookingView={bookingView}
      setBookingView={setBookingView}
      lastBookedClass={lastBookedClass}
      setLastBookedClass={setLastBookedClass}
      selectedBookingClass={selectedBookingClass}
      setSelectedBookingClass={setSelectedBookingClass}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      bookingCalendarStart={bookingCalendarStart}
      recurringPattern={recurringPattern}
      dateOverrides={dateOverrides}
      getClassesForDate={getClassesForDate}
    />,
    buy: <BuyTab />,
    profile: <ProfileTab 
      recurringPattern={recurringPattern} 
      setRecurringPattern={setRecurringPattern} 
      dateOverrides={dateOverrides}
      setDateOverrides={setDateOverrides}
      getClassesForDate={getClassesForDate}
      currentUser={currentUser} 
      setCurrentUser={setCurrentUser} 
    />,
    more: <MoreTab />,
  };

  return (
    <div className="bg-white h-screen flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {tabContent[activeTab]}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-stone-200 flex justify-around items-center h-24 px-4">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'book', icon: Calendar, label: 'Book' },
          { id: 'buy', icon: ShoppingBag, label: 'Buy' },
          { id: 'profile', icon: User, label: 'Profile' },
          { id: 'more', icon: MoreHorizontal, label: 'More' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'text-stone-900'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <tab.icon 
              className="w-6 h-6" 
              strokeWidth={2}
              style={{ color: activeTab === tab.id ? '#000' : 'currentColor' }}
            />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}