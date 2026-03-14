# Deployment & Testing Guide - Firestore Bookings & Attendance

**Date**: March 14, 2026  
**Version**: With 3 Core Workflows Implemented

---

## 📋 Pre-Deployment Checklist

- ✅ Firebase initialized (arikana-1e213)
- ✅ Firebase test button working
- ✅ saveBookingToFirestore function added
- ✅ loadBookingsFromFirestore function added
- ✅ saveAttendanceToFirestore function added
- ✅ Booking handler updated
- ✅ useEffect added for loading bookings
- ✅ Error handling and fallback to localStorage

---

## 🚀 Deployment Steps

### Step 1: Copy Updated File
```bash
# The updated file is at:
/mnt/user-data/outputs/App-FIRESTORE-BOOKINGS.jsx

# Replace your local copy:
cp /mnt/user-data/outputs/App-FIRESTORE-BOOKINGS.jsx C:\Arikana\src\App.jsx
```

### Step 2: Git Commit & Push
```powershell
cd C:\Arikana

# Check status
git status

# Add all changes
git add .

# Commit with message
git commit -m "feat: Implement Firestore booking save/load and attendance save workflows"

# Push to GitHub
git push origin main
```

### Step 3: Wait for GitHub Actions
- GitHub Actions will automatically build and deploy
- Wait 1-2 minutes for the deploy to complete
- Monitor the Actions tab in GitHub: https://github.com/nboitout/arikana/actions

### Step 4: Hard Refresh in Browser
```
1. Open: https://nboitout.github.io/arikana
2. Hard refresh: Ctrl+Shift+Delete (clear cache)
3. Then: Ctrl+F5 (reload)
4. Or: Cmd+Shift+Delete and Cmd+Shift+R on Mac
```

---

## 🧪 Testing Workflow 1: Booking Saves to Firestore

### Test Steps

**Step 1: Open DevTools**
```
Press F12 to open Developer Tools
Go to "Console" tab
Leave it open during the test
```

**Step 2: Sign In**
```
1. Open the Arikana app
2. Click "Sign In" (or sign up if new)
3. Use any email/password (it's mock auth)
4. You should see "Hi, Anechka" greeting
```

**Step 3: Test Firebase Connection First**
```
1. Go to Home tab
2. Click 🔥 Test button (top-right)
3. Wait 1-2 seconds
4. You should see:
   ✅ Firebase Connected!
   Wrote & read test data
   📊 Docs in test collection: X
```

**Step 4: Book a Class**
```
1. Go to Book tab
2. Select a future date
3. Click "Book Now" on any class
4. Read the confirmation details
5. Click "Confirm Booking" button
```

**Step 5: Check Console Output**
```
In the DevTools Console, you should see:

✅ Booking synced to Firestore

or if Firestore failed (localStorage fallback):

⚠️ Booking saved locally but Firestore sync failed: [error]
```

**Step 6: Verify in Firebase Console**
```
1. Go to: https://console.firebase.google.com/
2. Select project: arikana-1e213
3. Go to Firestore Database
4. Navigate: users → {userId} → bookings
5. You should see a new document with your booking data

Expected document structure:
{
  className: "Pilates Mat",
  instructor: "Angelina",
  time: "09:00",
  duration: "60 min",
  displayDate: "Mon, 14 Mar",
  dateObj: "2026-03-14T09:00:00.000Z",
  classId: 1,
  createdAt: "2026-03-14T...",
  attended: false,
  classDate: "2026-03-14"
}
```

---

## 🧪 Testing Workflow 2: Bookings Load from Firestore

### Test Steps

**Step 1: Make a Booking (from Workflow 1)**
```
Complete the booking process above
Booking should be in Firestore
```

**Step 2: Refresh the Page**
```
1. In the app, refresh the page
   Press: Ctrl+R (or Cmd+R on Mac)
2. App will reload
```

**Step 3: Sign In Again**
```
1. The app will show auth screen
2. Sign in with same email as before
3. Watch the Console for output
```

**Step 4: Check Console Output**
```
In the DevTools Console, you should see:

✅ Firebase Read Success! Documents: [count]
✅ Bookings loaded from Firestore: [count]

This means the booking was loaded from Firestore!
```

**Step 5: Verify in App**
```
1. Go to Book tab → My Booking section
2. You should see your previously booked class

Expected to see:
- Class name
- Date and time
- Instructor name
- "Cancel Booking" button (if you want to test cancellation)
```

**Step 6: Test Fallback to localStorage**
```
If Firestore loading fails (check console):

⚠️ Failed to load bookings from Firestore: [error]
✅ Bookings loaded from localStorage (Firestore fallback)

This means localStorage is working as a backup
```

---

## 🧪 Testing Workflow 3: Attendance Save (Coming Soon)

### Current Status
✅ Function implemented: `saveAttendanceToFirestore()`  
⏳ UI integration: Not yet (will be in next update)

### What It Will Do
When a lead trainer marks attendance for a class:
1. Trainer opens Profile → Attendance
2. Selects a class → checks/unchecks members
3. Clicks "💾 Save Attendance"
4. Function calls `saveAttendanceToFirestore(trainerId, attendanceData)`
5. Data saved to Firestore: `/users/{trainerId}/attendance/{docId}`

### Test After UI Integration
```
1. Sign in as a lead trainer
2. Go to Profile tab → Attendance
3. Select a class
4. Mark members as attended/no-show
5. Click "💾 Save Attendance"
6. Check Console for: ✅ Attendance saved to Firestore
7. Verify in Firebase Console: users → {trainerId} → attendance
```

---

## 📊 Expected Console Output Summary

### Successful Test
```
=== On Page Load ===
✅ Firebase Write Success! Document ID: abc123...

=== When Booking ===
✅ Booking saved to Firestore! ID: xyz789...
✅ Booking synced to Firestore

=== On Refresh (After Signing In) ===
✅ Firebase Read Success! Documents: 1
✅ Bookings loaded from Firestore: 1
```

### With Errors (But Still Works)
```
=== Firestore Error, Falls Back to localStorage ===
❌ Error loading bookings from Firestore: [error message]
⚠️ Failed to load bookings from Firestore: [error message]
✅ Bookings loaded from localStorage (Firestore fallback)
```

---

## 🔍 Troubleshooting

### Issue: App is blank after deploy
**Solution**:
```
1. Hard refresh: Ctrl+Shift+Delete then Ctrl+F5
2. Wait 30 seconds (GitHub Actions may still be deploying)
3. Check GitHub Actions tab to see if deploy completed
4. If still blank, check browser console (F12) for errors
```

### Issue: Firebase test shows error
**Solution**:
```
Possible causes:
1. Firebase config has wrong credentials
2. Firestore security rules don't allow test collection
3. Network connection issue

Check:
1. Verify FIREBASE_CONFIG has correct arikana-1e213 credentials
2. Go to Firebase Console → Firestore → Rules
3. Ensure rule allows read/write: if true; (dev mode)
4. Try again in 30 seconds
```

### Issue: Booking saves to localStorage but not Firestore
**Solution**:
```
This is OK - it's designed to work this way
Booking is immediately available in the app (from state + localStorage)
Firestore is saved asynchronously in the background

To verify it actually saved to Firestore:
1. Wait 2-3 seconds after booking
2. Check Firebase Console: users → {userId} → bookings
3. If document appears there, Firestore save worked

If document never appears in Firestore:
1. Check console for error message
2. Verify Firebase credentials in code
3. Check Firestore security rules
```

### Issue: Bookings don't load after refresh
**Solution**:
```
Step 1: Check localStorage fallback
- Open DevTools Console
- Type: localStorage.getItem('arikanaBookings')
- If it shows data, localStorage is working

Step 2: Check Firestore
- Go to Firebase Console
- users → {userId} → bookings
- See if documents exist there

Step 3: If localStorage has data but Firestore is empty
- Firestore load will fail
- App falls back to localStorage
- Booking will still appear (from localStorage)

Step 4: Check for errors
- Look in console for error messages
- Common error: "User ID is required"
  → Make sure you're signed in before refresh
```

---

## 🎯 Key Testing Scenarios

### Scenario 1: First Time Booking
```
1. Sign in for the first time
2. Book a class
3. Confirm booking
4. Check: Booking appears in "My Booking" section
5. Check Console: "✅ Booking synced to Firestore"
6. Check Firebase Console: New document in bookings/
```

### Scenario 2: Multiple Bookings
```
1. Sign in
2. Book 3 different classes
3. Check: All 3 appear in "My Booking" (closest date first)
4. Check Firebase Console: 3 documents in bookings/
5. Refresh page
6. Check: All 3 still appear
```

### Scenario 3: Offline Behavior
```
1. Book a class (while online)
2. Disconnect internet
3. Try to book another class
4. Booking saves to localStorage immediately (works offline)
5. Firestore save fails silently (console shows warning)
6. Reconnect internet
7. Refresh page
8. Bookings load from localStorage successfully
9. Next Firestore save will use new connection
```

### Scenario 4: Cross-Device Sync (Future)
```
Device A:
1. Sign in, book a class
2. Booking syncs to Firestore

Device B:
1. Sign in with same account
2. Refresh the app
3. Booking from Device A appears
4. New bookings will sync across devices

NOTE: This works because we load from Firestore on app start
```

---

## 📈 What's Working Now

✅ **Booking Saves**
- When you book a class, it saves to Firestore
- Immediate UI update (from state + localStorage)
- Async Firestore save in background
- Fallback to localStorage if Firestore fails

✅ **Bookings Load**
- On app start/sign in, bookings load from Firestore
- Falls back to localStorage if Firestore unavailable
- Date objects converted properly
- Sorted by closest date first

✅ **Attendance Function**
- Function is ready
- Just needs UI integration
- Will work same way as bookings (save + fallback)

---

## 🔮 What's Next

After testing these workflows:

1. **Re-add Attendance UI**
   - Menu item in Profile
   - Class list view
   - Mark attendance view
   - Connect "Save Attendance" button

2. **Health Data to Firestore**
   - Save health questionnaire to Firestore
   - Load on app start

3. **Real Authentication**
   - Replace mock localStorage auth
   - Use Firebase Authentication
   - Proper user accounts

4. **Mark Attended Status**
   - After class time passes
   - Lead trainer updates booking.attended = true
   - Affects "Booking History" display

5. **Security Rules**
   - Lock down Firestore
   - Users can only see their own data
   - Lead trainers can only write attendance

---

## 📚 File Locations

- **Updated App**: `/mnt/user-data/outputs/App-FIRESTORE-BOOKINGS.jsx`
- **Implementation Doc**: `/mnt/user-data/outputs/FIRESTORE_BOOKINGS_IMPLEMENTATION.md`
- **This Guide**: `/mnt/user-data/outputs/DEPLOYMENT_TESTING_GUIDE.md`

---

## ✅ Verification Checklist (After Deployment)

- [ ] App loads without blank page
- [ ] Firebase test button works (🔥 Test)
- [ ] Can sign in
- [ ] Can book a class
- [ ] Console shows "✅ Booking synced to Firestore"
- [ ] Booking appears in "My Booking" section
- [ ] Booking visible in Firebase Console
- [ ] Can refresh page
- [ ] Console shows "✅ Bookings loaded from Firestore"
- [ ] Booking still appears after refresh
- [ ] Console shows no critical errors

---

**Ready to Deploy!** 🚀