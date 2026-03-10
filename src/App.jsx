import React, { useState, useEffect } from 'react';
import { Home, Calendar, ShoppingBag, User, MoreHorizontal, ChevronRight } from 'lucide-react';
import './App.css';

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

  // Brand color
  const ARIKANA_COLOR = '#B69B4D';

  // Mock data
  const upcomingClasses = [
    { id: 1, name: 'Pilates Reformer', date: 'Monday, 09 Mar', time: '18:30', instructor: 'Anna', spots: 3 },
    { id: 2, name: 'Iyengar Yoga - General Class', date: 'Monday, 09 Mar', time: '18:30', instructor: 'Maya', spots: 5 },
    { id: 3, name: 'Hatha Flow', date: 'Tuesday, 10 Mar', time: '10:00', instructor: 'Sofia', spots: 8 },
    { id: 4, name: 'Private Pilates Session', date: 'Wednesday, 11 Mar', time: '14:00', instructor: '1-on-1', spots: 1 },
  ];

  // Home Tab Content
  const HomeTab = () => {
    const count172 = useCountUp(172, 1200);
    const count100 = useCountUp(100, 1200);

    return (
      <div className="pb-28">
        {/* Header with gradient */}
        <div style={{ background: `linear-gradient(to bottom, ${ARIKANA_COLOR}, ${ARIKANA_COLOR}cc)` }} className="text-white px-6 py-6">
          <p className="text-sm font-light mb-1">Hi, Анечка</p>
          <h1 className="text-2xl font-light">Welcome to Arikana Studio</h1>
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

            {/* Card 3 - Animated with Badge */}
            <div
              style={{ backgroundColor: ARIKANA_COLOR }}
              className="flex-shrink-0 w-40 text-white rounded-3xl p-5 snap-center relative"
            >
              <div style={{ backgroundColor: 'white', color: ARIKANA_COLOR }} className="absolute -top-3 -right-3 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg border-4 border-white shadow-lg">
                ✓
              </div>
              <p className="text-4xl font-bold mb-3">{count100}</p>
              <p className="text-xs font-light opacity-95 whitespace-pre-line leading-tight">Last achievement
100 classes</p>
            </div>
          </div>
        </div>

        {/* Upcoming Booking */}
        <div className="px-6 mb-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Upcoming booking</h2>
          <div className="bg-gray-100 rounded-3xl p-6 mb-4 text-center">
            <p className="text-stone-700 text-base font-normal">Nothing is currently scheduled</p>
          </div>
          <button style={{ backgroundColor: ARIKANA_COLOR }} className="w-full text-white font-medium py-4 rounded-3xl hover:opacity-90 transition-opacity text-lg">
            Explore
          </button>
        </div>

        {/* Coming Up */}
        <div className="px-6 pb-4">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Coming up</h2>
          <div className="space-y-2">
            {upcomingClasses.slice(0, 2).map((cls) => (
              <div key={cls.id} className="border border-stone-200 rounded-2xl p-4 hover:shadow-md transition-shadow bg-white">
                <h3 className="font-semibold text-stone-900 text-base">{cls.name}</h3>
                <p className="text-sm text-stone-500 mt-2 font-light">{cls.date} | {cls.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Book Tab Content - Calendar + Classes by Date
  const BookTab = () => {
    // Initialize with today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedInstructor, setSelectedInstructor] = useState('all');
    const [selectedBookingClass, setSelectedBookingClass] = useState(null);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);

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
    const classSchedule = {
      '2026-03-09': [ // Monday
        { id: 1, name: 'Pilates Mat', time: '09:00', duration: '60 min', instructor: 'Angelina', spots: 8 },
        { id: 2, name: 'Core Strength', time: '10:30', duration: '45 min', instructor: 'Nicolas', spots: 12 },
        { id: 3, name: 'Speed Skating', time: '09:30', duration: '50 min', instructor: 'Sergey', spots: 11 },
      ],
      '2026-03-10': [ // Tuesday - TODAY
        { id: 4, name: 'Pilates Reformer', time: '09:00', duration: '60 min', instructor: 'Nicolas', spots: 8 },
        { id: 5, name: 'Pelvic Curl Flow', time: '08:00', duration: '50 min', instructor: 'Angelina', spots: 10 },
        { id: 6, name: 'Ice Skating with Grace', time: '07:00', duration: '60 min', instructor: 'Sergey', spots: 14 },
        { id: 7, name: 'Advanced Pilates', time: '18:30', duration: '60 min', instructor: 'Nicolas', spots: 6 },
      ],
      '2026-03-11': [ // Wednesday
        { id: 8, name: 'Deep Core Activation', time: '11:00', duration: '60 min', instructor: 'Angelina', spots: 9 },
        { id: 9, name: 'Pilates Mat', time: '17:00', duration: '50 min', instructor: 'Nicolas', spots: 15 },
        { id: 10, name: 'Speed Skating', time: '09:30', duration: '50 min', instructor: 'Sergey', spots: 11 },
      ],
      '2026-03-12': [ // Thursday
        { id: 11, name: 'Advanced Pelvic Techniques', time: '17:00', duration: '60 min', instructor: 'Angelina', spots: 7 },
        { id: 12, name: 'Core Strength', time: '10:30', duration: '45 min', instructor: 'Nicolas', spots: 12 },
        { id: 13, name: 'Ice Skating Techniques', time: '16:00', duration: '60 min', instructor: 'Sergey', spots: 8 },
      ],
      '2026-03-13': [ // Friday
        { id: 14, name: 'Pilates Fusion', time: '19:00', duration: '55 min', instructor: 'Angelina', spots: 12 },
        { id: 15, name: 'Pilates Reformer', time: '09:00', duration: '60 min', instructor: 'Nicolas', spots: 7 },
        { id: 16, name: 'Crossfit on Ice', time: '18:00', duration: '55 min', instructor: 'Sergey', spots: 6 },
      ],
      '2026-03-14': [ // Saturday
        { id: 17, name: 'Pelvic Curl Flow', time: '10:30', duration: '50 min', instructor: 'Angelina', spots: 6 },
        { id: 18, name: 'Advanced Pilates', time: '18:30', duration: '60 min', instructor: 'Nicolas', spots: 5 },
        { id: 19, name: 'Speed Skating', time: '09:30', duration: '50 min', instructor: 'Sergey', spots: 11 },
      ],
      '2026-03-16': [ // Monday
        { id: 20, name: 'Pilates Mat', time: '09:00', duration: '60 min', instructor: 'Angelina', spots: 8 },
        { id: 21, name: 'Pilates Reformer', time: '18:30', duration: '60 min', instructor: 'Nicolas', spots: 4 },
        { id: 22, name: 'Ice Skating with Grace', time: '07:00', duration: '60 min', instructor: 'Sergey', spots: 14 },
      ],
      // Sunday (2026-03-15) - NO CLASSES - Rest day!
    };

    const instructors = {
      nicolas: { name: 'Nicolas', title: 'Pilates Specialist', rating: 4.9, reviews: 127, bio: 'Pilates and Pushups', photo: 'https://i.ibb.co/xKGQ2P8B/Nicolas-Boitout.png' },
      angelina: { name: 'Angelina', title: 'Pilates Master', rating: 5.0, reviews: 48, bio: 'Pelvic Curl Goddess', photo: 'https://i.ibb.co/8g8sMgRj/Angelina-Tricolici.png' },
      sergey: { name: 'Sergey', title: 'Crossfit Coach', rating: 4.8, reviews: 95, bio: 'Siberian Crossfitter', photo: 'https://i.ibb.co/nNGSPCsY/Sergey.png' },
    };

    // Generate 7 days starting from today
    const getDayDates = () => {
      const dates = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        dates.push(d);
      }
      return dates;
    };

    const dayDates = getDayDates();

    // Get classes for selected date
    const dateStr = selectedDate.toISOString().split('T')[0];
    const classesForDay = classSchedule[dateStr] || [];
    const filteredClasses = selectedInstructor === 'all' 
      ? classesForDay 
      : classesForDay.filter(c => c.instructor.toLowerCase() === selectedInstructor);

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

    // Handle booking confirmation
    const handleBooking = () => {
      setBookingConfirmed(true);
      // Here we would send booking data to backend/email service
      // Example:
      // fetch('/api/booking', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     classId: selectedBookingClass.id,
      //     className: selectedBookingClass.name,
      //     date: selectedDate,
      //     instructor: selectedBookingClass.instructor,
      //     userEmail: 'user@example.com' // Would get from user profile
      //   })
      // })
    };

    // Booking Confirmation View
    if (selectedBookingClass && bookingConfirmed) {
      return (
        <div className="pb-28">
          {/* Header */}
          <div style={{ backgroundColor: ARIKANA_COLOR }} className="text-white px-6 py-3">
            <h1 className="text-lg font-light text-center">Booking Confirmation</h1>
          </div>

          {/* Success Message - Compact */}
          <div className="px-6 py-4 text-center">
            <div className="text-5xl mb-2">✅</div>
            <h2 className="text-xl font-bold text-stone-900 mb-1">You're Booked!</h2>
            <p className="text-sm text-stone-600 mb-4">Your spot is confirmed. See you soon!</p>

            {/* Booking Details - Compact Grid */}
            <div className="bg-stone-50 rounded-lg p-3 mb-3 text-left text-sm grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wide mb-0.5">Class</p>
                <p className="font-bold text-stone-900">{selectedBookingClass.name}</p>
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wide mb-0.5">Instructor</p>
                <p className="font-bold text-stone-900">{selectedBookingClass.instructor}</p>
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wide mb-0.5">Date & Time</p>
                <p className="text-stone-900">{formatDateDetail(selectedDate)} • {selectedBookingClass.time}</p>
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wide mb-0.5">Duration</p>
                <p className="text-stone-900">{selectedBookingClass.duration}</p>
              </div>
            </div>

            {/* Info Message - Compact */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-4 text-xs">
              <p className="text-blue-900">📧 Confirmation email sent to your account</p>
            </div>
          </div>

          {/* Button - Visible */}
          <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-6 pb-4">
            <button
              style={{ backgroundColor: ARIKANA_COLOR }}
              className="w-full text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              onClick={() => {
                setSelectedBookingClass(null);
                setBookingConfirmed(false);
              }}
            >
              Back to Booking Calendar
            </button>
          </div>
        </div>
      );
    }

    // Booking Detail View
    if (selectedBookingClass) {
      const instructor = getInstructorData(selectedBookingClass.instructor);
      const description = classDescriptions[selectedBookingClass.name] || 'Professional class instruction.';

      return (
        <div className="pb-28">
          {/* Header */}
          <div style={{ backgroundColor: ARIKANA_COLOR }} className="text-white px-6 py-4 flex justify-between items-center">
            <button onClick={() => setSelectedBookingClass(null)} className="text-2xl">←</button>
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

    // Classes List View
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

                    {/* Right: Title, Rating, Bio */}
                    <div className="flex flex-col justify-start flex-1 min-w-0 gap-0.5">
                      <p className="text-xs opacity-80">{instr.title}</p>
                      <div className="flex gap-1 text-xs">
                        <span>⭐ {instr.rating}</span>
                      </div>
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

          {selectedDate.getDay() === 0 ? (
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
                    <span style={{ backgroundColor: ARIKANA_COLOR }} className="text-xs font-medium text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                      {cls.spots} spots
                    </span>
                  </div>

                  <div className="flex gap-3 text-xs text-stone-600 mb-2">
                    <span>⏱️ {cls.time} • {cls.duration}</span>
                  </div>

                  <button
                    onClick={() => setSelectedBookingClass(cls)}
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
          )}
        </div>
      </div>
    );
  };

  // Buy Tab Content
  const BuyTab = () => {
    const [selectedPackage, setSelectedPackage] = useState(null);

    // Mat & Floor Classes Detail
    if (selectedPackage === 'mat-floor') {
      const autopays = [
        { name: 'Arikana Commitment M&F', sessions: '9 sessions ☆', price: '245 RON' },
        { name: 'Arikana Commitment M&F', sessions: '16 sessions ☆', price: '295 RON' },
        { name: 'Arikana Commitment M&F 1 month', sessions: 'unlimited ☆', price: '395 RON' },
      ];

      const pricing = [
        { name: 'Mat&Floor - 1 session', price: '120 RON' },
        { name: 'Mat&Floor Classes - 9 sessions', price: '290 RON' },
        { name: 'Mat&Floor Classes - 16 sessions', price: '350 RON' },
        { name: 'Mat&Floor Classes 1 month - Unlimited', price: '450 RON' },
      ];

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
                  <div key={i} className="border-b border-stone-200 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-stone-900">{item.name}</p>
                        <p className="text-sm text-stone-600">{item.sessions}</p>
                        <p className="text-xs text-stone-500 mt-1">Autopay</p>
                      </div>
                      <p className="font-bold text-stone-900">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Options Section */}
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Pricing Options</h2>
              <div className="space-y-4">
                {pricing.map((item, i) => (
                  <div key={i} className="border-b border-stone-200 pb-4">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-stone-900">{item.name}</p>
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
  const ProfileTab = () => {
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);

    const paymentMethods = [
      { type: 'Mastercard', last4: '9909', expires: '09/2029' },
    ];

    const purchaseHistory = [
      { name: 'M&F Classes - 1 Month', price: '295,00 RON', date: 'Purchased 20.01.2026' },
      { name: 'M&F Classes - 1 Month', price: '295,00 RON', date: 'Purchased 20.01.2026' },
    ];

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
            <h2 className="text-xl font-bold text-stone-900">Anya Glushkova</h2>
            <p className="text-sm text-stone-600 mt-1">Active Member</p>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            {[
              { label: 'My Bookings', icon: '📅', id: 'bookings' },
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

          <button style={{ color: ARIKANA_COLOR, borderColor: ARIKANA_COLOR }} className="w-full font-medium py-3 border-2 rounded-xl hover:opacity-80 transition-opacity mt-6">
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
    home: <HomeTab />,
    book: <BookTab />,
    buy: <BuyTab />,
    profile: <ProfileTab />,
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
