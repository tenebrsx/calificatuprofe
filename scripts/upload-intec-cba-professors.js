#!/usr/bin/env node

/**
 * Script to upload INTEC Ciencias Básicas y Ambientales professors to the database
 * 
 * Usage: node scripts/upload-intec-cba-professors.js
 */

const fetch = require('node-fetch');

async function uploadProfessors() {
  try {
    console.log('🚀 Starting INTEC CBA professors upload...');
    
    // Determine the base URL based on environment
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
    const apiUrl = `${baseUrl}/api/professors/intec-cba`;
    
    console.log(`📡 Calling API: ${apiUrl}`);
    
    // Make the POST request to upload professors
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Upload successful!');
      console.log(`📊 Results:`, data.results);
      console.log(`📝 Message: ${data.message}`);
      
      if (data.results.errors > 0) {
        console.log('⚠️  Errors occurred:');
        data.results.errorDetails?.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error}`);
        });
      }
    } else {
      console.error('❌ Upload failed:', data.error);
      if (data.details) {
        console.error('💡 Details:', data.details);
      }
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Script error:', error.message);
    process.exit(1);
  }
}

// Run the upload
uploadProfessors(); 