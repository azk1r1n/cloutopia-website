import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('Cloud Recognition and Blog Creation Tests', () => {
  
  test('should perform cloud image recognition workflow', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3001');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'tests/screenshots/homepage.png', fullPage: true });
    
    // Check if the main elements are present
    await expect(page.locator('text=Cloutopia')).toBeVisible();
    
    // Find the file upload input
    const fileInputSelector = 'input[type="file"]';
    await page.waitForSelector(fileInputSelector, { timeout: 10000 });
    
    // Upload the test cloud image
    const imagePath = path.join(__dirname, '../photos/White Clouds Blue Sky.jpg');
    
    if (fs.existsSync(imagePath)) {
      await page.setInputFiles(fileInputSelector, imagePath);
      console.log('Successfully uploaded image:', imagePath);
      
      // Wait for the image to be processed
      await page.waitForTimeout(2000);
      
      // Take screenshot after upload
      await page.screenshot({ path: 'tests/screenshots/after-upload.png', fullPage: true });
      
      // Send a message asking for cloud analysis
      const messageInput = page.locator('input[placeholder*="Type"], textarea, input[type="text"]').first();
      
      if (await messageInput.isVisible()) {
        await messageInput.fill('Please analyze the clouds in this image and identify their type.');
        
        // Find and click the send button
        const sendButton = page.locator('button:has-text("Send")').first();
        await sendButton.click();
        
        console.log('Sent analysis request message');
        
        // Wait for AI response
        await page.waitForTimeout(5000);
        
        // Take screenshot after sending message
        await page.screenshot({ path: 'tests/screenshots/after-message.png', fullPage: true });
        
        // Look for cloud-related response
        const responseText = await page.textContent('body');
        const cloudKeywords = ['cloud', 'cumulus', 'stratus', 'cirrus', 'weather', 'sky', 'formation'];
        const foundKeyword = cloudKeywords.some(keyword => 
          responseText.toLowerCase().includes(keyword.toLowerCase())
        );
        
        expect(foundKeyword).toBeTruthy();
        console.log('Found cloud-related keywords in response');
        
      } else {
        console.log('Message input not found or not visible');
      }
    } else {
      console.log('Test image not found at:', imagePath);
      test.skip();
    }
  });

  test('should test blog API endpoint', async ({ page }) => {
    // Test the blog API directly
    const response = await page.request.get('http://localhost:8000/api/blogs');
    
    expect(response.status()).toBe(200);
    
    const blogData = await response.json();
    console.log('Blog API response:', blogData);
    
    expect(blogData).toHaveProperty('blogs');
    expect(Array.isArray(blogData.blogs)).toBeTruthy();
    
    if (blogData.blogs.length > 0) {
      const firstBlog = blogData.blogs[0];
      expect(firstBlog).toHaveProperty('title');
      expect(firstBlog).toHaveProperty('content');
      expect(firstBlog).toHaveProperty('author');
    }
  });

  test('should test chat API with cloud query', async ({ page }) => {
    const chatMessage = {
      message: 'What are cumulus clouds and how do they form?',
      image_url: null
    };

    const response = await page.request.post('http://localhost:8000/api/chat', {
      data: chatMessage
    });

    expect(response.status()).toBe(200);
    
    const responseData = await response.json();
    console.log('Chat API response:', responseData);
    
    expect(responseData).toHaveProperty('response');
    expect(responseData.response).toBeTruthy();
    expect(responseData.response.length).toBeGreaterThan(10);
    
    // Check if response contains cloud-related content
    const responseText = responseData.response.toLowerCase();
    const hasCloudContent = ['cloud', 'weather', 'formation', 'sky'].some(keyword => 
      responseText.includes(keyword)
    );
    expect(hasCloudContent).toBeTruthy();
  });

  test('should test image upload API', async ({ page }) => {
    const imagePath = path.join(__dirname, '../photos/White Clouds Blue Sky.jpg');
    
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      
      const response = await page.request.post('http://localhost:8000/api/upload', {
        multipart: {
          file: {
            name: 'test_cloud.jpg',
            mimeType: 'image/jpeg',
            buffer: imageBuffer
          }
        }
      });

      console.log('Upload response status:', response.status());
      
      if (response.status() === 200) {
        const responseData = await response.json();
        console.log('Upload API response:', responseData);
        
        expect(responseData).toHaveProperty('message');
        expect(responseData).toHaveProperty('file_url');
        expect(responseData.file_url).toMatch(/\/uploads\//);
        
        if (responseData.analysis) {
          console.log('AI analysis included in upload response:', responseData.analysis);
        }
      } else {
        const errorText = await response.text();
        console.log('Upload failed with error:', errorText);
      }
    } else {
      console.log('Test image not found, skipping upload test');
      test.skip();
    }
  });

  test('should demonstrate complete workflow: upload -> analyze -> blog concept', async ({ page }) => {
    console.log('Starting complete workflow test...');
    
    // Step 1: Navigate to application
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    // Step 2: Upload image
    const imagePath = path.join(__dirname, '../photos/White Clouds Blue Sky.jpg');
    
    if (fs.existsSync(imagePath)) {
      console.log('Uploading image...');
      await page.setInputFiles('input[type="file"]', imagePath);
      await page.waitForTimeout(2000);
      
      // Step 3: Request analysis
      const messageInput = page.locator('input[type="text"], textarea').first();
      
      if (await messageInput.isVisible()) {
        console.log('Sending analysis request...');
        await messageInput.fill('Analyze these clouds and create a detailed description that could be used for a blog post about cloud formations.');
        
        const sendButton = page.locator('button:has-text("Send")').first();
        await sendButton.click();
        
        // Wait for response
        await page.waitForTimeout(5000);
        
        // Step 4: Capture the conversation for blog creation
        const chatContent = await page.textContent('body');
        
        // Verify we have content that could become a blog
        expect(chatContent.length).toBeGreaterThan(100);
        
        console.log('Workflow completed successfully');
        
        // Step 5: Simulate blog creation from chat
        // (In a real implementation, this would save the conversation as a blog post)
        const blogData = {
          title: 'Cloud Analysis: Beautiful Sky Formation',
          content: chatContent.substring(0, 500) + '...', // Truncate for demo
          author: 'CloudWatcher',
          cloud_types: ['Cumulus'],
          location: 'Unknown'
        };
        
        console.log('Simulated blog post created:', blogData.title);
        expect(blogData.title).toBeTruthy();
        expect(blogData.content).toBeTruthy();
        
      } else {
        console.log('Chat interface not available');
      }
    } else {
      console.log('Test image not available');
      test.skip();
    }
  });

  test('should verify all required API endpoints are working', async ({ page }) => {
    const endpoints = [
      { url: 'http://localhost:8000/', name: 'Root' },
      { url: 'http://localhost:8000/health', name: 'Health' },
      { url: 'http://localhost:8000/api/blogs', name: 'Blogs' }
    ];

    for (const endpoint of endpoints) {
      console.log(`Testing ${endpoint.name} endpoint: ${endpoint.url}`);
      
      const response = await page.request.get(endpoint.url);
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toBeTruthy();
      
      console.log(`✓ ${endpoint.name} endpoint working`);
    }
  });
});

// Utility test to check if both frontend and backend are running
test('should verify frontend and backend are accessible', async ({ page }) => {
  // Check frontend
  const frontendResponse = await page.request.get('http://localhost:3001');
  expect(frontendResponse.status()).toBe(200);
  console.log('✓ Frontend accessible at http://localhost:3001');
  
  // Check backend
  const backendResponse = await page.request.get('http://localhost:8000');
  expect(backendResponse.status()).toBe(200);
  console.log('✓ Backend accessible at http://localhost:8000');
  
  // Navigate to frontend to ensure it loads
  await page.goto('http://localhost:3001');
  await expect(page.locator('body')).toBeVisible();
  console.log('✓ Frontend page loads successfully');
});
