// ChatGPT Cookie-based Authentication
// Uses browser cookies to authenticate with ChatGPT API

export interface ChatGPTCookie {
  domain: string;
  name: string;
  value: string;
  path: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: string;
}

export class ChatGPTAuth {
  private cookies: ChatGPTCookie[];
  private sessionToken: string;
  
  constructor(cookies: ChatGPTCookie[]) {
    this.cookies = cookies;
    // Extract session token
    const sessionCookie = cookies.find(c => c.name === '__Secure-next-auth.session-token');
    this.sessionToken = sessionCookie?.value || '';
  }

  /**
   * Get cookie string for requests
   */
  getCookieString(): string {
    return this.cookies
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');
  }

  /**
   * Get headers for authenticated requests
   */
  getHeaders(): Record<string, string> {
    return {
      'Cookie': this.getCookieString(),
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://chatgpt.com/',
      'Origin': 'https://chatgpt.com',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
    };
  }

  /**
   * Make authenticated request to ChatGPT API
   */
  async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `https://chatgpt.com${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`ChatGPT API error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  /**
   * Generate image using DALL-E through ChatGPT
   */
  async generateImage(prompt: string, size: string = '1024x1024'): Promise<string> {
    // First, get conversation ID
    const conversationResponse = await this.makeRequest('/backend-api/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'next',
        messages: [{
          role: 'user',
          content: {
            content_type: 'text',
            parts: [`Generate an image: ${prompt}`]
          }
        }],
        model: 'gpt-4-dalle',
        timezone_offset_min: -480,
        suggestions: [],
        history_and_training_disabled: false,
        conversation_mode: {
          kind: 'primary_assistant'
        },
        force_paragen: false,
        force_rate_limit: false
      })
    });

    const data = await conversationResponse.json();
    
    // Extract image URL from response
    if (data.message?.content?.parts?.[0]?.asset_pointer) {
      return data.message.content.parts[0].asset_pointer;
    }

    throw new Error('Failed to generate image');
  }
}

// Default cookies from the provided data
export const DEFAULT_COOKIES: ChatGPTCookie[] = [
  {
    "domain": ".chatgpt.com",
    "name": "__Secure-next-auth.session-token",
    "value": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..o-cmr-PKnX_UvXhe.YTOFTjTYXI8pidwXHyVijua2p9-DIYbJgLg-VgXOllvt_GjkaxYp0T-okfgG-67eB4yQ9FjbtbaORSFOv73-066QmobMWlxsvE9nqS2VJqqJiBX4iBGCnNC78HwYMSeUKEkJXcJZFE1HFciUnvDt4J3W1LITW2ayLON_NqBM13sK9x49gnw-TeOddjOZeZTqaMp9IduQ5t1PvKfL4kFh0QP402k8zBHLzdD3unt3WdY-c4QeU8MHYko5lrKei4N4-CsNJTFEuSCT59zVYvGiZbQmOh9IJxw9plsbPIskZuJiUECJfqUU5R9k8mik69yy8ZTiC35vN1x91ISefL0L0iVYc0yFkTjxB-x64ELk9JJOACg9r47ky9iu6AfwOfJ20ANMwT1cH5DS1HT0938Ny8c0taV29g3w1F4rcM-Ndl9s65SMzKzDZZrTRte5c-OLCLghsFm3U5YO2BA2ro1MQCRXVUlfbv0tl_GJEpJZD95fSjMPJDuCuTvibzwXQ8Nsl4ddfHLxNBnivK69vcQhNcFvtD4sTdh0OQvmXMJW5DmmaBpm4dR-z8NsPB-p4Ffx6-8LIU3PT2GkNK83tgQrakE5cDlhiDNDi0tv4NJOvPw-cdBSL576tl1lVOGiE27S-_JUCy7ogSNjF6m2oGSk0vxWMUX0cxtYrJC2jNT2frBiAcgvrTgo33dIjDvJkoWuMy6mL4Z5WQb4VwGMVBzgACzjfdnBcV9FRKWcBs01FirdVHbK8FxiAkzRbmxHyVcw4RMbZWQ_zq7GLpJ69Rx7Me1E4zPrKMwqZ54J7VBWKGHK4YtAOFnx3honWSLYJl4zigq5Qt3-rVk7KUnSViX6fcsmtMiNNOXP6icRQ_M0vm9d5qrshcSVcpdGNid_XqqCGCSle-i7dWvsrf4LZqd2RoG4unCvSJ5OobUdwfiuQOW27oG_1TZZmNosbVv-HMJnD6e9zbodkb2gnjeH8tNr6bDQmRwZ9oBuEqFJao00PXZTL0LSt627h9SUQa1pUxqJvIT7e3JqatULIcV6Cy-vX5LTiyQXf1iWStl0iRBIyvDP0HIa9ZGMBdHyis8Cd5kjD-HLidZA85RJJXQdkz3wwBdjzLDVVHs7ukmCAkU6ODfKnuEPIm70MhbdUvBRSOC2nPvLdjs2lNsNicl1Px0WDjCzUPnneEn0H7FyaHRMe4R44olCKZZWlCHgMhh4FyLXxZYLf6EsNXGyKH8H-1DAKLL2ZHOlF5WoOORdRYQ4azcQ56kamtyk4cnlWcVpo1FKnS-2NA8QGtFAEnD3je-_MLdkmxbN2Zmjxqyre9YURnqM3BjrAX1rKUq9nphQBXUTGnWc2ZV5Z8oRKjo-bkNNylWoXNO_2JnNqtLN9Oua3XPZXTF1e3FhVtiPZ6_sUi6pFNsJjZC2yxTWfQ3L2qJGXzPzoljOIxK2Tja650ljFMH7yLX3p8EvSqjfUnyEbv6rmjSkivQRis_XFcYzKXWmawLg3d3sXd-xzRpZLnV-awh54XRltFalY0cqUdogs-4fyCnwO9XrLezJ2zXqbsPOENcktlY1VXTPsMxzCFAv5Uj-oZzI_4IIkcezWplhBluXXtOdDPKZM2ZYonpD-RWfJPHoCKnITu2tYM1D7l31rQ6h2wr5gNowos6vwUxDXeqc-L31fJzyNPZ-WXSWv6xh4v8M9pFshfzm3bxP9hBKWlyJRFB87vmoUN19gtIUffwSvyvX6NGB-c3OtnEZzVU9JAy_B9Z1k56Ulm_G9fLwQ3GpPsXPZZUtnUm5ysKZ5DDO0i8QPvEBoxTh6diGY1PKi-8xL4Ng2jOqP6P9P9II-lthKpYzZR5xFW2QgO33FvZCvbd4nSWM56nQNBAWY4GRO0SQiRBc2oolTvUYDAl-1jy7CMpEb95I4RNPwqxRiVoceeAUVkZ1OA1naca4Qb_t6_CtQhvc3JuzgWMdPO6iExxaGZSPJMSEID16zxwnAOIK19miRg-VeReeIpF-8Xj4LaLgEk7tmpxHeN9lpOjZbsHvhDXAmPfnIA1rpX5gLiamslfehWzkc2tZ41c5-GVa5pn4mKNMktixc7dP1XclAxxOYmqqRV-8X9f7nBVAsMM2T69VWUTz5lh110ioUitGcSnhuw5_ndZDc4R6u1w9glrQVLESQpPFBb2Aas-PXMKtzi6ZRvBm2qr9aW9Nvo-tVO3IbpV76hmpe_dEgyPAkx70jT61en3UdFywn8z4Xa5o78GRh2azXdBlezRRR4n-vhHpNVTvhS5MO9cRr9x0nb2W4MyXBH5lXrRshLWebly7gXl_AD-RPXLIWm_91QL5FYR773DYautDGUnJQ5bPg-EKX47MchM_xjL1JPWmpRxoh7DJyUcx1hB6M_uCcsbocMA8Gn2YCI4Gp2t88NBZPzXVAsYWsKPygcemlHzymmSB4UVquqjlzGCYxb7jWKFBptKsfvSZMS30PAZh77aIy8dcTFVFoBbMVGDeIY3CtykdgsOvvaY3T1ASsI6YxRMQTwcsvJRmQ1j_uqtIZJppOO7D9z2Zo6j2yvfQuzajeDjPgKh4Xi8y6mFa8MFVjfDoRa_VnWAKVnefuf3zHuGMDbhu46DODYQh2YjELRbWjfeqnb_JpzuuLY6xPRqxpMbZ0muthJrUym5QOp04YToPvsaviLznCYhqI0-FtoiK3UA_bxpJyEZU6_LKcVzYjxMi7I4bq7o16OnuqKcCxDjSn6yTpCZuoUFK5uOHCJA4gGMxzPu4r4qWxiJ6t5FTz-J-XhiBHuVyM4nZYHlfLpR9t_n6MxVAFj5qPV-l9PeRQvJmjyZecDJFXVFfyiOkVm7VsgN_LRMS2fFfkztp4Qq8Zv7sPCgS0GyZz4MVdEIsk_iEBERaFhmCkFLW1Z8kuTY5wjTW3XRc4FYWtt-HVflAz3QvFikjbfhijopNS4IrCOCdslFwYwroB89TNsdTM8L69hCxLSVsp3bdP-NuRVg-qOsE0hg9Icod77nOJR1_M-fJEAOncOM0DGIq3p3CfeMvNvAS20-d6uOxnvWURxYK9Ib6TrFZ0ynB1I6OnESUq2gT.v3x9nqa6SBmjTMPuDFLZyw",
    "path": "/",
    "httpOnly": true,
    "secure": true
  },
  {
    "domain": ".chatgpt.com",
    "name": "_cfuvid",
    "value": "c5ICUbdRIxBvevg.53Ke6dCzhcP1uyReKZwezt.qr6I-1755040540062-0.0.1.1-604800000",
    "path": "/",
    "httpOnly": true,
    "secure": true
  },
  {
    "domain": ".chatgpt.com",
    "name": "oai-did",
    "value": "a17d8419-2a97-47dc-a71b-1e05d34ed3d2",
    "path": "/",
    "httpOnly": false,
    "secure": false
  },
  {
    "domain": ".chatgpt.com",
    "name": "oai-sc",
    "value": "0gAAAAABom8scl4u4i73WwaTA6ejSOlL_mfXdBfttTtc7f5v2Sg5yc5hJXEkCv3qE5jIua1MD_S6egHEcjdg_9BPVcy4pRzL56PA2BTZxWDzPG3Cg8VHz54Gu5yvSshW-YBuwJ29xqliO4ebx4g0x5wqy8NkgANlKfP8a8NboN5kG1Z35exG_8TOcFloyZd5SuyslQgi3uBRlD8aKQw7UtzfiszlS2DO3mCHGNLoIO-hqa2VdtNNygDVUbK4R2k0XOllMqCIVBfoU",
    "path": "/",
    "httpOnly": false,
    "secure": true
  },
  {
    "domain": "chatgpt.com",
    "name": "__cflb",
    "value": "0H28vzvP5FJafnkHxismneyU88nn9MN3ehUSSGwATaK",
    "path": "/",
    "httpOnly": true,
    "secure": true
  },
  {
    "domain": "chatgpt.com",
    "name": "__Host-next-auth.csrf-token",
    "value": "ce858e3a7cb5e8efa9e4ecb0cfa41e9ad307a9b7adf391a8745e533bc894689c%7C77384b154a369c3e70aaf64eeaf951bd9ab3989e99a62a14ad067af156549354",
    "path": "/",
    "httpOnly": true,
    "secure": true
  },
  {
    "domain": "chatgpt.com",
    "name": "__Secure-next-auth.callback-url",
    "value": "https%3A%2F%2Fchatgpt.com",
    "path": "/",
    "httpOnly": true,
    "secure": true
  }
];