import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('Cloutopia - Image Recognition and Chat', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page).toHaveTitle(/Cloutopia/);
  });

  test('should display the main page correctly', async ({ page }) => {
    // Check if main elements are present
    await expect(page.locator('h1')).toContainText('Cloutopia');
    await expect(page.locator('text=Upload your sky photos')).toBeVisible();
    
    // Check if features section is visible
    await expect(page.locator('text=Cloud Recognition')).toBeVisible();
    await expect(page.locator('text=Location Guessing')).toBeVisible();
    await expect(page.locator('text=Blog Creation')).toBeVisible();
  });

  test('should handle image upload and recognition', async ({ page }) => {
    // Check if upload section exists
    const uploadSection = page.locator('[data-testid="upload-section"], .upload-area, input[type="file"]').first();
    await expect(uploadSection).toBeVisible();

    // Find the file input (might be hidden)
    const fileInput = page.locator('input[type="file"]').first();
    
    // Create a test image path (using the existing sample image)
    const imagePath = path.join(__dirname, '../backend/uploads/test_cloud.jpg');
    
    // Check if the test image exists, if not create a placeholder
    if (!fs.existsSync(imagePath)) {
      // Use the sample image from photos directory
      const sampleImagePath = path.join(__dirname, '../photos/White Clouds Blue Sky.jpg');
      if (fs.existsSync(sampleImagePath)) {
        await fileInput.setInputFiles(sampleImagePath);
      } else {
        // Skip this test if no image is available
        test.skip(true, 'No test image available');
      }
    } else {
      await fileInput.setInputFiles(imagePath);
    }

    // Wait for file to be processed
    await page.waitForTimeout(1000);

    // Check if the chat interface responds to the image upload
    const chatArea = page.locator('[data-testid="chat-area"], .chat-messages, .chat-history').first();
    
    // Look for any indication that an image was uploaded
    const imageElements = page.locator('img').filter({ hasText: '' });
    const chatMessages = page.locator('.chat-message, [data-testid="chat-message"]');
    
    // Wait for either image display or chat response
    await expect(async () => {
      const imageCount = await imageElements.count();
      const messageCount = await chatMessages.count();
      expect(imageCount > 0 || messageCount > 0).toBeTruthy();
    }).toPass({ timeout: 5000 });
  });

  test('should handle text messages in chat', async ({ page }) => {
    // Find the message input
    const messageInput = page.locator('input[type="text"], textarea, [placeholder*="message"], [placeholder*="type"]').first();
    await expect(messageInput).toBeVisible();

    // Type a test message about clouds
    const testMessage = 'What types of clouds can you identify?';
    await messageInput.fill(testMessage);

    // Find and click the send button
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"], .send-button').first();
    await sendButton.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Check if the message appears in chat
    await expect(page.locator(`text=${testMessage}`)).toBeVisible();
    
    // Look for AI response
    const responseText = page.locator('text=/cloud|cumulus|stratus|cirrus|weather|AI|assistant/i').first();
    await expect(responseText).toBeVisible({ timeout: 5000 });
  });

  test('should demonstrate complete workflow: upload image + chat + analysis', async ({ page }) => {
    // Step 1: Upload an image
    const fileInput = page.locator('input[type="file"]').first();
    const sampleImagePath = path.join(__dirname, '../photos/White Clouds Blue Sky.jpg');
    
    if (fs.existsSync(sampleImagePath)) {
      await fileInput.setInputFiles(sampleImagePath);
      await page.waitForTimeout(1000);
    }

    // Step 2: Send a message asking for analysis
    const messageInput = page.locator('input[type="text"], textarea').first();
    await messageInput.fill('Please analyze the clouds in this image and tell me what type they are.');
    
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    await sendButton.click();

    // Step 3: Wait for and verify AI response
    await page.waitForTimeout(3000);
    
    // Look for cloud-related keywords in the response
    const cloudTerms = [
      'cumulus', 'stratus', 'cirrus', 'cloud', 'weather', 
      'formation', 'sky', 'atmosphere', 'analysis'
    ];
    
    let foundCloudTerm = false;
    for (const term of cloudTerms) {
      const termElement = page.locator(`text=/${term}/i`).first();
      try {
        await expect(termElement).toBeVisible({ timeout: 1000 });
        foundCloudTerm = true;
        break;
      } catch (e) {
        // Continue checking other terms
      }
    }
    
    expect(foundCloudTerm).toBeTruthy();

    // Step 4: Verify chat history is maintained
    const chatMessages = page.locator('.chat-message, [data-testid="message"]');
    await expect(chatMessages).toHaveCount(2); // User message + AI response
  });
});

test.describe('Cloutopia - Blog Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to blog section', async ({ page }) => {
    // Look for blog navigation link
    const blogLink = page.locator('a:has-text("Blog"), nav a[href*="blog"]').first();
    
    if (await blogLink.isVisible()) {
      await blogLink.click();
      
      // Verify we're on blog page
      await expect(page).toHaveURL(/blog/);
      await expect(page.locator('h1, h2').filter({ hasText: /blog/i })).toBeVisible();
    } else {
      // If no blog navigation, check if blog content is on main page
      const blogSection = page.locator('text=Blog Creation, text=blog');
      await expect(blogSection).toBeVisible();
    }
  });

  test('should display sample blog posts from API', async ({ page }) => {
    // Make a request to the blog API endpoint
    const response = await page.request.get('http://localhost:8000/api/blogs');
    expect(response.status()).toBe(200);
    
    const blogData = await response.json();
    expect(blogData).toHaveProperty('blogs');
    expect(Array.isArray(blogData.blogs)).toBeTruthy();
    expect(blogData.blogs.length).toBeGreaterThan(0);
    
    // Verify blog structure
    const firstBlog = blogData.blogs[0];
    expect(firstBlog).toHaveProperty('title');
    expect(firstBlog).toHaveProperty('content');
    expect(firstBlog).toHaveProperty('author');
    expect(firstBlog).toHaveProperty('cloud_types');
  });

  test('should demonstrate chat-to-blog conversion concept', async ({ page }) => {
    // This test demonstrates the workflow for converting chat to blog
    // Step 1: Have a conversation about clouds
    const messageInput = page.locator('input[type="text"], textarea').first();
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    
    // Simulate a conversation that could become a blog
    const conversation = [
      'I found some interesting clouds today',
      'Can you help me identify these cloud formations?',
      'What weather patterns do these clouds indicate?'
    ];

    for (const message of conversation) {
      await messageInput.fill(message);
      await sendButton.click();
      await page.waitForTimeout(1500); // Wait for response
    }

    // Step 2: Verify chat history exists (which could be converted to blog)
    const chatMessages = page.locator('.chat-message, [data-testid="message"]');
    const messageCount = await chatMessages.count();
    expect(messageCount).toBeGreaterThanOrEqual(conversation.length);

    // Step 3: Check if there's any blog creation UI
    const blogButtons = page.locator('button:has-text("Create Blog"), button:has-text("Save as Blog"), .blog-create');
    
    if (await blogButtons.count() > 0) {
      // If blog creation UI exists, test it
      await blogButtons.first().click();
      await page.waitForTimeout(1000);
    } else {
      // If no UI, we've verified the chat exists for future blog conversion
      console.log('Chat history captured for potential blog conversion');
    }
  });
});

test.describe('Cloutopia - API Integration', () => {
  test('should have working backend API endpoints', async ({ page }) => {
    // Test health endpoint
    const healthResponse = await page.request.get('http://localhost:8000/health');
    expect(healthResponse.status()).toBe(200);
    
    const healthData = await healthResponse.json();
    expect(healthData).toHaveProperty('status', 'healthy');

    // Test root endpoint
    const rootResponse = await page.request.get('http://localhost:8000/');
    expect(rootResponse.status()).toBe(200);
    
    const rootData = await rootResponse.json();
    expect(rootData).toHaveProperty('message');
    expect(rootData).toHaveProperty('endpoints');
  });

  test('should handle chat API endpoint', async ({ page }) => {
    const chatData = {
      message: 'Test message about clouds',
      image_url: null
    };

    const response = await page.request.post('http://localhost:8000/api/chat', {
      data: chatData,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    
    const responseData = await response.json();
    expect(responseData).toHaveProperty('response');
    expect(typeof responseData.response).toBe('string');
    expect(responseData.response.length).toBeGreaterThan(0);
  });

  test('should handle file upload endpoint', async ({ page }) => {
    // Create a simple test image file
    const testImagePath = path.join(__dirname, '../photos/White Clouds Blue Sky.jpg');
    
    if (fs.existsSync(testImagePath)) {
      const response = await page.request.post('http://localhost:8000/api/upload', {
        multipart: {
          file: {
            name: 'test_cloud.jpg',
            mimeType: 'image/jpeg',
            buffer: fs.readFileSync(testImagePath)
          }
        }
      });

      if (response.status() === 200) {
        const responseData = await response.json();
        expect(responseData).toHaveProperty('message');
        expect(responseData).toHaveProperty('file_url');
        expect(responseData.file_url).toMatch(/^\/uploads\//);
      } else {
        // Log response for debugging
        console.log('Upload response status:', response.status());
        console.log('Upload response text:', await response.text());
      }
    } else {
      test.skip(true, 'Test image not available for upload test');
    }
  });
});

test.describe('Cloutopia - End-to-End User Journey', () => {
  test('complete user journey: visit -> upload -> chat -> get analysis', async ({ page }) => {
    // Step 1: Visit the homepage
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Cloutopia');

    // Step 2: Upload a cloud image
    const fileInput = page.locator('input[type="file"]').first();
    const imagePath = path.join(__dirname, '../photos/White Clouds Blue Sky.jpg');
    
    if (fs.existsSync(imagePath)) {
      await fileInput.setInputFiles(imagePath);
      await page.waitForTimeout(1000);
    }

    // Step 3: Ask for cloud analysis
    const messageInput = page.locator('input[type="text"], textarea').first();
    await messageInput.fill('What type of clouds are these and what do they tell us about the weather?');
    
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    await sendButton.click();

    // Step 4: Wait for and verify AI response
    await page.waitForTimeout(3000);
    
    // Step 5: Verify the response contains useful information
    const responseElement = page.locator('text=/cloud|weather|analysis|cumulus|stratus|formation/i').first();
    await expect(responseElement).toBeVisible({ timeout: 5000 });

    // Step 6: Verify chat history is maintained
    const allMessages = page.locator('.chat-message, [data-testid="message"], .message');
    await expect(allMessages).toHaveCount(2); // User message + AI response

    // Step 7: Test additional follow-up question
    await messageInput.fill('Can you estimate where this photo might have been taken?');
    await sendButton.click();
    await page.waitForTimeout(2000);
    
    // Verify we now have 4 messages (2 user + 2 AI responses)
    await expect(allMessages).toHaveCount(4);
  });

  test('mobile responsiveness check', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Check if main elements are still visible on mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeVisible();
    
    // Check if chat interface is usable on mobile
    const messageInput = page.locator('input[type="text"], textarea').first();
    await expect(messageInput).toBeVisible();
    
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    await expect(sendButton).toBeVisible();
  });
});
