import React, { useState } from 'react';
import { Home, Calendar, ShoppingBag, User, MoreHorizontal, ChevronRight } from 'lucide-react';
import './App.css';

export default function ArikanaApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [userName] = useState('Nicolas');

  // Brand color
  const ARIKANA_COLOR = '#B69B4D';

  // Mock data
  const upcomingClasses = [
    { id: 1, name: 'Pilates Reformer', date: 'Monday, 09 Mar', time: '18:30', instructor: 'Anna', spots: 3 },
    { id: 2, name: 'Iyengar Yoga - General Class', date: 'Monday, 09 Mar', time: '18:30', instructor: 'Maya', spots: 5 },
    { id: 3, name: 'Hatha Flow', date: 'Tuesday, 10 Mar', time: '10:00', instructor: 'Sofia', spots: 8 },
    { id: 4, name: 'Private Pilates Session', date: 'Wednesday, 11 Mar', time: '14:00', instructor: '1-on-1', spots: 1 },
  ];

  const achievements = [
    { label: 'Total classes\nSince Feb 11, 2025', value: '172', icon: '🏅' },
    { label: 'Classes this month\nSince Mar 1, 2026', value: '0', icon: '📅' },
    { label: 'Last achievement\n100 classes', value: '100', icon: '🎯', badge: true },
  ];

  // Home Tab Content
  const HomeTab = () => (
    <div className="pb-28">
      {/* Header with gradient */}
      <div style={{ background: `linear-gradient(to bottom, ${ARIKANA_COLOR}, ${ARIKANA_COLOR}cc)` }} className="text-white px-6 py-6">
        <p className="text-sm font-light mb-1">Hi, {userName}</p>
        <h1 className="text-2xl font-light">Welcome to Arikana Studio</h1>
      </div>

      {/* Achievements Section */}
      <div className="px-6 mt-6 mb-8">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Achievements</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
          {achievements.map((item, i) => (
            <div
              key={i}
              style={{ backgroundColor: ARIKANA_COLOR }}
              className="flex-shrink-0 w-40 text-white rounded-3xl p-5 snap-center relative"
            >
              {item.badge && (
                <div style={{ backgroundColor: 'white', color: ARIKANA_COLOR }} className="absolute -top-3 -right-3 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg border-4 border-white shadow-lg">
                  ✓
                </div>
              )}
              <p className="text-4xl font-bold mb-3">{item.value}</p>
              <p className="text-xs font-light opacity-95 whitespace-pre-line leading-tight">{item.label}</p>
            </div>
          ))}
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

  // Book Tab Content - With Instructor Photo
  const BookTab = () => {
    const [selectedFilter, setSelectedFilter] = useState('All');

    const instructorClasses = [
      { id: 1, name: 'Pilates Reformer', time: '09:00', duration: '60 min', level: 'All Levels', spots: 8 },
      { id: 2, name: 'Core Strength', time: '10:30', duration: '45 min', level: 'Intermediate', spots: 12 },
      { id: 3, name: 'Advanced Pilates', time: '18:30', duration: '60 min', level: 'Advanced', spots: 6 },
      { id: 4, name: 'Pilates Mat', time: '17:00', duration: '50 min', level: 'Beginner', spots: 15 },
    ];

    return (
      <div className="pb-28">
        {/* Golden Header */}
        <div style={{ backgroundColor: ARIKANA_COLOR }} className="text-white px-6 py-6">
          <div className="mb-4">
            <h1 className="text-2xl font-light mb-1">Book Classes</h1>
            <p className="text-sm opacity-90">Choose your instructor</p>
          </div>

          {/* Instructor Card with Photo */}
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }} className="rounded-xl p-4">
            <div className="flex gap-3">
              {/* Photo Circle */}
              <div className="w-20 h-20 rounded-full bg-white flex-shrink-0 overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src="https://i.ibb.co/xKGQ2P8B/Nicolas-Boitout.png"
                  alt="Nicolas"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="text-white flex-1">
                <h2 className="text-lg font-semibold mb-1">Nicolas</h2>
                <p className="text-sm opacity-90 mb-2">Pilates Specialist</p>
                <div className="flex gap-2 text-xs">
                  <span>⭐ 4.9</span>
                  <span>(127 reviews)</span>
                </div>
                <p className="text-xs opacity-85 mt-1">Expert in hardcore pilates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="px-6 py-3 flex gap-2 overflow-x-auto">
          {['All', 'Reformer', 'Mat', 'Advanced'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              style={{
                backgroundColor: selectedFilter === filter ? ARIKANA_COLOR : '#e8e8e8',
                color: selectedFilter === filter ? '#fff' : '#333'
              }}
              className="px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all hover:opacity-90"
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Classes List */}
        <div className="px-6 mt-6">
          <h3 className="text-sm font-semibold text-stone-900 mb-3">Available Classes</h3>
          <div className="space-y-3">
            {instructorClasses.map((cls) => (
              <div key={cls.id} className="bg-white border border-stone-200 rounded-xl p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">{cls.name}</h4>
                    <p className="text-xs text-stone-600 mt-1">with Nicolas</p>
                  </div>
                  <span style={{ backgroundColor: ARIKANA_COLOR }} className="text-xs font-medium text-white px-2 py-1 rounded-full whitespace-nowrap">
                    {cls.level}
                  </span>
                </div>

                <div className="flex gap-3 text-xs text-stone-600 mb-3">
                  <span>⏱️ {cls.time} • {cls.duration}</span>
                  <span>👥 {cls.spots} spots</span>
                </div>

                <button
                  style={{ 
                    borderColor: ARIKANA_COLOR,
                    color: ARIKANA_COLOR
                  }}
                  className="w-full border-2 text-white font-semibold py-2 rounded-lg transition-all hover:opacity-80 text-sm"
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
        </div>
      </div>
    );
  };

  // Buy Tab Content
  const BuyTab = () => (
    <div className="pb-28">
      <div style={{ background: `linear-gradient(to bottom, ${ARIKANA_COLOR}, ${ARIKANA_COLOR}cc)` }} className="text-white px-6 py-8 rounded-b-3xl">
        <h1 className="text-2xl font-light">Memberships & Packages</h1>
      </div>

      <div className="px-6 mt-8">
        <div className="space-y-4">
          {[
            { name: 'Unlimited Classes', price: '$199/month', desc: 'All yoga & pilates classes' },
            { name: '8-Class Pack', price: '$149', desc: 'Valid for 3 months' },
            { name: '4-Class Pack', price: '$89', desc: 'Valid for 3 months' },
            { name: 'Private Session', price: '$120', desc: 'One-on-one coaching' },
          ].map((pkg, i) => (
            <div key={i} className="border border-stone-200 rounded-2xl p-4 hover:border-stone-300 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-stone-900">{pkg.name}</h3>
                <span style={{ color: ARIKANA_COLOR }} className="font-bold">{pkg.price}</span>
              </div>
              <p className="text-sm text-stone-600 mb-3">{pkg.desc}</p>
              <button style={{ borderColor: ARIKANA_COLOR, color: ARIKANA_COLOR }} className="w-full border-2 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity text-sm">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Profile Tab Content
  const ProfileTab = () => (
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
          <h2 className="text-xl font-bold text-stone-900">{userName}</h2>
          <p className="text-sm text-stone-600 mt-1">Active Member</p>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {[
            { label: 'My Bookings', icon: '📅' },
            { label: 'Membership', icon: '🎫' },
            { label: 'Payment Methods', icon: '💳' },
            { label: 'Notifications', icon: '🔔' },
            { label: 'Preferences', icon: '⚙️' },
            { label: 'Help & Support', icon: '❓' },
            { label: 'About Arikana', icon: 'ℹ️' },
          ].map((item, i) => (
            <button key={i} className="w-full text-left border border-stone-200 rounded-xl p-4 hover:bg-stone-50 transition-colors flex items-center justify-between">
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
      {/* Status Bar Simulation */}
      <div style={{ background: `linear-gradient(to bottom, ${ARIKANA_COLOR}, ${ARIKANA_COLOR}cc)` }} className="text-white px-6 pt-3 pb-2 flex justify-between items-center text-xs font-semibold">
        <span>12:36</span>
        <div className="flex gap-1 items-center">
          <span>📶 5G</span>
          <span className="bg-black bg-opacity-40 px-2 py-1 rounded">27</span>
        </div>
      </div>

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
