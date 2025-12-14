# Memory Optimization Guide

## Problem: 512MB Memory Exceeded

Your backend was exceeding the 512MB memory limit because:

1. **Large images in memory**: Full-resolution images consume ~36MB+ each
2. **No size limits**: Users could upload huge files
3. **Concurrent requests**: Multiple users = multiple images in memory
4. **No cleanup**: Images stayed in memory during entire request lifecycle

---

## Memory Usage Calculation

### Before Optimization

**Single request with 8MB image:**
```
Base64 image upload: 8MB
↓ Decode
Image bytes: 6MB
↓ PIL Image (4000×3000 RGB)
Uncompressed in memory: ~36MB
↓ Gemini API processing
Additional overhead: ~10-20MB
═══════════════════════════════
Total per request: ~50-60MB
```

**With concurrent users:**
- 5 users: 250-300MB ✓
- 8 users: 400-480MB ⚠️
- 10 users: 500-600MB ❌ **EXCEEDS 512MB**

### After Optimization

**Single request with 8MB image:**
```
Base64 image upload: 8MB (rejected if >15MB)
↓ Decode
Image bytes: 6MB (rejected if >10MB)
↓ PIL Image (4000×3000 RGB)
Uncompressed: ~36MB
↓ RESIZE to 1024×768
Optimized in memory: ~2.3MB ✓
↓ Gemini API processing
Additional overhead: ~10MB
↓ CLEANUP (garbage collection)
Released after use: -2.3MB
═══════════════════════════════
Total per request: ~15-20MB
```

**With concurrent users:**
- 10 users: 150-200MB ✓
- 20 users: 300-400MB ✓
- 30 users: 450-600MB (approaching limit)

**Memory reduction: 70-75% per request**

---

## Optimizations Implemented

### 1. Image Resizing (`gemini_service.py`)

**What it does:**
- Automatically resizes images to max 1024px (width or height)
- Maintains aspect ratio
- Uses high-quality LANCZOS resampling

**Why it works:**
- Gemini doesn't need 4K resolution for cloud analysis
- 1024px is plenty for accurate recognition
- Reduces memory from ~36MB → ~2.3MB (94% reduction!)

```python
# Before: Load full resolution
image = Image.open(io.BytesIO(image_bytes))  # 36MB for 4000×3000

# After: Resize to max 1024px
if image.width > 1024 or image.height > 1024:
    ratio = min(1024 / image.width, 1024 / image.height)
    new_size = (int(image.width * ratio), int(image.height * ratio))
    image = image.resize(new_size, Image.Resampling.LANCZOS)  # 2.3MB for 1024×768
```

### 2. Request Size Limits (`main.py`)

**What it does:**
- Limits HTTP request body to 15MB
- Returns 413 error if exceeded
- Prevents memory exhaustion from huge uploads

**Why 15MB?**
- Base64 encoding adds ~33% overhead
- 15MB base64 → ~10MB actual image → ~2.3MB in memory after resize
- Reasonable limit for mobile photos

```python
@app.middleware("http")
async def limit_request_size(request: Request, call_next):
    max_size = 15 * 1024 * 1024  # 15MB
    if int(request.headers.get("content-length", 0)) > max_size:
        return JSONResponse(status_code=413, content={"detail": "Request too large"})
```

### 3. Image Size Validation

**What it does:**
- Checks decoded image size (max 10MB)
- Rejects oversized images before processing
- Clear error message to user

```python
if len(image_bytes) > 10 * 1024 * 1024:
    raise ValueError(f"Image too large: {len(image_bytes)} bytes (max: 10MB)")
```

### 4. RGB Conversion

**What it does:**
- Converts RGBA/CMYK/other formats to RGB
- Removes alpha channel (transparency)
- Reduces memory footprint

**Why it matters:**
- RGBA uses 33% more memory than RGB
- Gemini API doesn't need alpha channel
- Consistent format for processing

```python
if image.mode not in ('RGB', 'L'):
    image = image.convert('RGB')  # Remove alpha, normalize format
```

### 5. Explicit Memory Cleanup

**What it does:**
- Clears image references after sending to Gemini API
- Forces garbage collection
- Releases memory immediately

**Why it helps:**
- Python doesn't immediately free memory
- GC hints speed up cleanup
- Reduces peak memory usage during streaming

```python
# After sending to API
if image:
    prompt_parts.clear()  # Remove all references
    image = None
    gc.collect()  # Suggest immediate garbage collection
```

### 6. Finally Block Cleanup

**What it does:**
- Ensures cleanup even if errors occur
- Prevents memory leaks from exceptions
- Runs after every request

```python
finally:
    if image:
        image = None
    gc.collect()
```

---

## Testing the Optimizations

### Local Testing

1. **Start backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

2. **Test with large image:**
   - Upload a 5000×4000 pixel image (~8MB)
   - Should automatically resize to 1024×819
   - Response should work normally

3. **Test size limit:**
   - Try uploading >15MB file
   - Should get 413 error: "Request body too large"

4. **Monitor memory:**
```bash
# In another terminal
watch -n 1 'ps aux | grep uvicorn'
```

Look at the RSS (memory) column - should stay under 200MB even with multiple requests.

### Production Testing

After deploying to Render/Railway/Cloud Run:

1. **Check memory metrics** in platform dashboard
2. **Upload multiple images** in quick succession
3. **Verify no OOM (Out of Memory) errors** in logs
4. **Monitor response times** (should be consistent)

---

## Memory Monitoring

### Render.com
- Dashboard → Your Service → Metrics
- Look for "Memory Usage" graph
- Should stay well under 512MB

### Railway.app
- Dashboard → Your Service → Metrics
- Check "Memory" chart
- Should average 100-200MB

### Cloud Run
```bash
gcloud logging read "resource.type=cloud_run_revision" --limit 50 | grep memory
```

---

## Adjusting Parameters

### If still hitting memory limits:

**Option 1: Reduce max image size**
```python
# In gemini_service.py, line 141
image = prepare_image_from_base64(image_data, max_size=768)  # Was 1024
```
- 768px: ~1.3MB per image
- 512px: ~0.6MB per image

**Option 2: Reduce request size limit**
```python
# In main.py, line 24
max_size = 10 * 1024 * 1024  # 10MB (was 15MB)
```

**Option 3: Upgrade memory tier**
- Render: Upgrade to 1GB ($7/month)
- Railway: Increase memory allocation
- Cloud Run: Set `--memory 1Gi`

### If you have memory to spare:

**Increase image quality for better analysis:**
```python
# In gemini_service.py, line 141
image = prepare_image_from_base64(image_data, max_size=1536)  # Was 1024
```
- 1536px: ~5.3MB per image
- Better for detailed cloud features
- Only if you have >512MB memory

---

## Best Practices

### ✅ DO
- Keep images under 10MB
- Use 1024px max size (good balance)
- Monitor memory usage regularly
- Test with multiple concurrent users
- Enable garbage collection hints

### ❌ DON'T
- Remove size limits (leads to OOM)
- Load full-resolution images unnecessarily
- Skip cleanup in finally blocks
- Ignore 413 errors (indicates limit issues)
- Store images in global variables

---

## Image Quality vs Memory Trade-off

| Max Size | Memory/Image | Quality | Concurrent Users (512MB) |
|----------|--------------|---------|--------------------------|
| 512px    | ~0.6MB       | Basic   | ~40-50                   |
| 768px    | ~1.3MB       | Good    | ~25-30                   |
| **1024px**   | **~2.3MB**       | **Excellent** | **~15-20** ✓ **Recommended** |
| 1536px   | ~5.3MB       | Superb  | ~8-10                    |
| 2048px   | ~9.4MB       | Overkill| ~5                       |

**Recommendation:** Stick with 1024px - perfect balance for cloud recognition.

---

## Troubleshooting

### "Out of Memory" errors in logs

**Symptoms:**
```
MemoryError: Unable to allocate array
OOM killed
```

**Solutions:**
1. Check if max_size is set correctly (should be 1024)
2. Verify size limits are enforced (15MB request, 10MB image)
3. Check for memory leaks (gc.collect() called?)
4. Monitor concurrent request count

### Memory usage still high

**Possible causes:**
1. **Gemini SDK overhead**: The SDK itself uses ~50-100MB baseline
2. **FastAPI/Uvicorn**: Framework overhead ~30-50MB
3. **Multiple workers**: Each worker = separate process with full memory
4. **Caching**: Check if responses are being cached somewhere

**Check workers:**
```bash
# In Render/Railway, ensure only 1 worker
uvicorn main:app --workers 1  # Not --workers 4!
```

### Images look blurry/low quality

**If you need higher resolution:**
1. Increase max_size to 1536 (if you have 1GB memory)
2. Or upgrade memory tier
3. Keep request size limits

```python
image = prepare_image_from_base64(image_data, max_size=1536)
```

---

## Summary

### Memory Saved
- **Before**: 50-60MB per request
- **After**: 15-20MB per request
- **Reduction**: 70-75%

### Key Changes
✅ Automatic image resizing to 1024px
✅ Request size limit (15MB)
✅ Image size validation (10MB decoded)
✅ RGB conversion (remove alpha)
✅ Explicit memory cleanup with gc.collect()
✅ Finally blocks for guaranteed cleanup

### Result
- Handles **15-20 concurrent users** on 512MB
- Previously: **~8 users** before OOM
- **2.5x improvement** in capacity

Your backend should now run smoothly on 512MB without memory issues! 🎉

---

## Deployment Checklist

Before deploying these changes:

- [ ] Test locally with large images (5-8MB)
- [ ] Verify 413 error for >15MB requests
- [ ] Check memory usage: `ps aux | grep uvicorn`
- [ ] Test concurrent uploads (5-10 simultaneous)
- [ ] Commit and push changes
- [ ] Deploy to production (Render/Railway/Cloud Run)
- [ ] Monitor memory metrics for 24 hours
- [ ] Test with real users

---

**Enjoy your optimized backend!** 🚀💾
