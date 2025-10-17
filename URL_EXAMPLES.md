# Real URL Examples

## Example 1: Initial Partner Links

### Partner A's Link:
```
https://insama.site/?session=collab-1703123456789&partner=partner1&data=eyJpZCI6ImNvbGxhYi0xNzAzMTIzNDU2Nzg5IiwicGFydG5lcjEiOnsibmFtZSI6IlRyYWN5In0sInBhcnRuZXIyIjp7Im5hbWUiOiJNaWtlIn0sInN0YXR1cyI6ImFjdGl2ZSJ9
```

### Partner B's Link:
```
https://insama.site/?session=collab-1703123456789&partner=partner2&data=eyJpZCI6ImNvbGxhYi0xNzAzMTIzNDU2Nzg5IiwicGFydG5lcjEiOnsibmFtZSI6IlRyYWN5In0sInBhcnRuZXIyIjp7Im5hbWUiOiJNaWtlIn0sInN0YXR1cyI6ImFjdGl2ZSJ9
```

## Example 2: After Partner A Completes

```
https://insama.site/?session=collab-1703123456789&partner=partner1&data=eyJpZCI6ImNvbGxhYi0xNzAzMTIzNDU2Nzg5IiwicGFydG5lcjEiOnsibmFtZSI6IlRyYWN5In0sInBhcnRuZXIyIjp7Im5hbWUiOiJNaWtlIn0sInN0YXR1cyI6ImFjdGl2ZSIsInBhcnRuZXIxUmVzcG9uc2UiOnsicGFydG5lcklkIjoicGFydG5lcjEiLCJjb21wbGV0ZWRBdCI6IjIwMjQtMTItMjFUMTA6MzA6MDBaIiwiYmlsbHMiOlt7Im5hbWUiOiJFbGVjdHJpY2l0eSIsImFtb3VudCI6MTIwLCJyZXNwb25zaWJsZVBhcnRuZXIiOiJwYXJ0bmVyMSJ9LHsibmFtZSI6IkdhcyIsImFtb3VudCI6ODAsInJlc3BvbnNpYmxlUGFydG5lciI6InBhcnRuZXIxIn1dLCJpc0NvbXBsZXRlIjp0cnVlfX0%3D
```

## Example 3: Final Shared Link (After Conflicts Resolved)

```
https://insama.site/?session=collab-1703123456789&shared=true&data=eyJpZCI6ImNvbGxhYi0xNzAzMTIzNDU2Nzg5IiwicGFydG5lcjEiOnsibmFtZSI6IlRyYWN5In0sInBhcnRuZXIyIjp7Im5hbWUiOiJNaWtlIn0sInN0YXR1cyI6Im1lcmdlZCIsImNvbmZsaWN0cyI6W3siaWQiOiJjb25mbGljdC1lbGVjdHJpY2l0eSIsInR5cGUiOiJiaWxsX3Jlc3BvbnNpYmlsaXR5IiwiaXRlbU5hbWUiOiJFbGVjdHJpY2l0eSIsInBhcnRuZXIxQ2hvaWNlIjoicGFydG5lcjEiLCJwYXJ0bmVyMkNob2ljZSI6InBhcnRuZXIyIiwicmVzb2x1dGlvbiI6InNoYXJlZCJ9XSwibWVyZ2VkRGF0YSI6eyJiaWxscyI6W3sibmFtZSI6IkVsZWN0cmljaXR5IiwiYW1vdW50IjoxMjAsInJlc3BvbnNpYmxlUGFydG5lciI6InNoYXJlZCJ9XX19
```

## Decoded Data Examples

### Initial Session Data:
```json
{
  "id": "collab-1703123456789",
  "partner1": { "name": "Tracy" },
  "partner2": { "name": "Mike" },
  "status": "active"
}
```

### After Partner A Completes:
```json
{
  "id": "collab-1703123456789",
  "partner1": { "name": "Tracy" },
  "partner2": { "name": "Mike" },
  "status": "active",
  "partner1Response": {
    "partnerId": "partner1",
    "completedAt": "2024-12-21T10:30:00Z",
    "bills": [
      { "name": "Electricity", "amount": 120, "responsiblePartner": "partner1" },
      { "name": "Gas", "amount": 80, "responsiblePartner": "partner1" }
    ],
    "isComplete": true
  }
}
```

### Final Merged Data:
```json
{
  "id": "collab-1703123456789",
  "partner1": { "name": "Tracy" },
  "partner2": { "name": "Mike" },
  "status": "merged",
  "conflicts": [
    {
      "id": "conflict-electricity",
      "type": "bill_responsibility",
      "itemName": "Electricity",
      "partner1Choice": "partner1",
      "partner2Choice": "partner2",
      "resolution": "shared"
    }
  ],
  "mergedData": {
    "bills": [
      { "name": "Electricity", "amount": 120, "responsiblePartner": "shared" }
    ]
  }
}
```

## URL Length Analysis

- **Initial URL**: ~150 characters
- **After Partner A completes**: ~300 characters  
- **Final merged URL**: ~400 characters

Most browsers support URLs up to 2,048 characters, so this approach is well within limits.

## How Partners Share URLs

### Method 1: Copy & Paste
1. Partner A completes their section
2. Browser URL automatically updates with their data
3. Partner A copies URL from address bar
4. Shares via WhatsApp, email, text, etc.
5. Partner B opens the shared URL

### Method 2: QR Code (if needed)
```typescript
// Generate QR code for URL
import QRCode from 'qrcode';

const generateQRCode = async (url: string) => {
  const qrCodeDataURL = await QRCode.toDataURL(url);
  return qrCodeDataURL;
};
```

### Method 3: Built-in Share API
```typescript
// Use native sharing on mobile
if (navigator.share) {
  await navigator.share({
    title: 'Insama Session',
    url: currentURL
  });
}
```
