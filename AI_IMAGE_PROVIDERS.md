# AI Image Provider System

## Overview
Grid 2.0 now supports multiple AI image generation providers with automatic fallback. The system tries providers in order of preference and falls back to Unsplash placeholders if none are configured.

## Supported Providers

### 1. OpenAI DALL-E 3
- **Quality**: Highest quality, best prompt understanding
- **Cost**: $0.016-$0.032 per image
- **Speed**: 5-10 seconds
- **Get API Key**: https://platform.openai.com/api-keys

### 2. Stability AI (Stable Diffusion XL)
- **Quality**: Excellent quality, fast generation
- **Cost**: $0.002-$0.004 per image
- **Speed**: 2-5 seconds  
- **Get API Key**: https://platform.stability.ai/account/keys

### 3. Replicate (Multiple Models)
- **Quality**: Good quality, many model options
- **Cost**: $0.001-$0.003 per image
- **Speed**: 3-8 seconds
- **Get API Token**: https://replicate.com/account/api-tokens

### 4. Together AI
- **Quality**: Good quality, cost-effective
- **Cost**: $0.001-$0.002 per image
- **Speed**: 2-4 seconds
- **Get API Key**: https://api.together.xyz/settings/api-keys

### 5. Unsplash (Fallback)
- **Quality**: Stock photos only
- **Cost**: Free
- **Speed**: Instant
- **Note**: Used when no AI providers are configured

## Configuration

Add API keys to `.env.local`:

```bash
# AI Image Providers (optional, system will use Unsplash if none configured)
OPENAI_API_KEY=your_openai_api_key_here
STABILITY_API_KEY=your_stability_api_key_here  
REPLICATE_API_TOKEN=your_replicate_token_here
TOGETHER_API_KEY=your_together_api_key_here
```

## API Usage

### Generate Image
```bash
POST /api/generate-image
```

Request body:
```json
{
  "prompt": "A minimalist tech startup hero image",
  "style": "minimal",        // optional: photorealistic, artistic, minimal, bold, playful
  "aspectRatio": "16:9",      // optional: 1:1, 16:9, 9:16, 4:3, 3:4
  "quality": "standard",      // optional: draft, standard, high
  "negative": "text, words"   // optional: what to avoid
}
```

Response:
```json
{
  "success": true,
  "image": "https://...",     // Image URL or base64 data
  "provider": "OpenAI",       // Which provider was used
  "model": "dall-e-3",        // Model name
  "estimatedCost": 0.016,     // Cost in USD
  "metadata": {...}           // Provider-specific metadata
}
```

### Check Provider Status
```bash
GET /api/generate-image
```

Response:
```json
{
  "status": "ready",
  "configuredProviders": ["OpenAI DALL-E", "Stability AI"],
  "totalProviders": 4,
  "hasAnyProvider": true,
  "fallbackAvailable": true,
  "supportedStyles": ["photorealistic", "artistic", "minimal", "bold", "playful"],
  "supportedAspectRatios": ["1:1", "16:9", "9:16", "4:3", "3:4"],
  "supportedQualities": ["draft", "standard", "high"]
}
```

## Testing

Run the test suite:
```bash
node test-image-providers.mjs
```

This will:
1. Check provider configuration
2. Test each style and aspect ratio
3. Report costs and performance
4. Save results to JSON file

## Style Guidelines

### Photorealistic
- Professional photography look
- High detail and realism
- Best for: Corporate sites, portfolios

### Artistic  
- Creative and painterly
- Unique visual style
- Best for: Creative agencies, art projects

### Minimal
- Clean and simple
- Geometric shapes
- Best for: Tech startups, modern brands

### Bold
- High contrast and dramatic
- Strong visual impact
- Best for: Fashion, entertainment

### Playful
- Colorful and fun
- Whimsical elements
- Best for: Kids apps, games

## Cost Optimization

1. **Use draft quality** for development/testing
2. **Cache generated images** to avoid regeneration  
3. **Use Unsplash fallback** for prototypes
4. **Batch similar requests** to optimize API calls

## Fallback Chain

The system automatically tries providers in this order:
1. OpenAI DALL-E (if configured)
2. Stability AI (if configured)
3. Replicate (if configured)
4. Together AI (if configured)
5. Unsplash (always available)

## Troubleshooting

### No images generating
- Check API keys in `.env.local`
- Verify provider status: `GET /api/generate-image`
- Check server logs for errors

### High costs
- Switch to "draft" quality
- Use smaller aspect ratios
- Consider Stability AI or Together AI for lower costs

### Slow generation
- Together AI and Stability are fastest
- Use "draft" quality for speed
- Consider pre-generating common images

## Security Notes

- **NEVER** commit API keys to git
- **ALWAYS** use environment variables
- **NEVER** expose keys to client-side code
- Keep `.env.local` in `.gitignore`

## Future Enhancements

- [ ] Add Midjourney support (via proxy)
- [ ] Implement image caching layer
- [ ] Add batch generation endpoint
- [ ] Support custom fine-tuned models
- [ ] Add image editing capabilities