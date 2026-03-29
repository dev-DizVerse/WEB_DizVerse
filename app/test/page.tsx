"use client";

import { useEffect } from "react";

export default function TestPage() {
  useEffect(() => {
    console.log('=== LocalStorage Test ===');
    console.log('localStorage available:', typeof localStorage !== 'undefined');
    console.log('Current user:', localStorage.getItem('currentUser'));
    console.log('User role:', localStorage.getItem('userRole'));
    
    // Test setting and getting
    localStorage.setItem('test', 'hello');
    console.log('Test get:', localStorage.getItem('test'));
    localStorage.removeItem('test');
    
    // List all localStorage items
    console.log('All localStorage items:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        console.log(`  ${key}: ${localStorage.getItem(key)}`);
      }
    }
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>LocalStorage Test</h1>
      <p>Check browser console (F12) for debug information</p>
      <button onClick={() => window.location.href = '/'}>Back to Home</button>
    </div>
  );
}
