# Mobile Home Park Information Management System

## Project Overview
A lightweight web application for managing and tracking information across multiple mobile home parks. Park managers can submit and update their park's information through dedicated forms, while owners can view all parks' data on a centralized dashboard.

## Key Features
- **Individual Park Forms**: Each park has a unique URL for data submission
- **Centralized Dashboard**: View all parks' information in one place
- **Real-time Updates**: Information updates immediately upon submission
- **Cloud Storage**: Data persists using Vercel KV (Redis-like storage)
- **Mobile Responsive**: Works seamlessly on all devices

## Supported Parks
The system currently supports 6 park codes:
- `MNSHAF` - Minnesota Shady Acres Farm
- `MNRFC` - Minnesota River Front Community
- `MNWAT` - Minnesota Waterside
- `MOGV` - Missouri Green Valley
- `MOASH` - Missouri Ashwood
- `MISOL` - Mississippi Solace

## Project Structure
```
/
├── api/                    # Serverless API functions
│   ├── parks.js           # GET all parks data
│   └── park/
│       └── [code].js      # GET/POST individual park data
├── dashboard.html         # Main dashboard view
├── form.html             # Park information submission form
├── favicon.ico           # Site favicon
├── server.js             # Local development server (Express)
├── package.json          # Dependencies and scripts
├── vercel.json           # Vercel deployment configuration
└── overview.md           # This file
```

## Technology Stack
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Node.js with Express (local) / Vercel Serverless Functions (production)
- **Database**: 
  - Local: SQLite
  - Production: Vercel KV (Key-Value store)
- **Hosting**: Vercel

## Installation & Setup

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/BuildThingsThatBuildthings/mhpquickinfo.git
cd mhpquickinfo
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
# Server runs at http://localhost:3000
```

### Production Deployment (Vercel)

1. **Fork/Clone the repository to your GitHub account**

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

3. **Set up Vercel KV Storage**
   - In your Vercel project dashboard, go to "Storage"
   - Click "Create Database" → "KV"
   - Connect the KV store to your project
   - The connection will be automatic via environment variables

4. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - Your app will be available at `https://your-project.vercel.app`

## API Endpoints

### GET `/api/parks`
Returns all parks' data sorted by last update time.

**Response:**
```json
[
  {
    "park_code": "MNSHAF",
    "park_name": "Shady Acres",
    "lot_rent": 450,
    "manager_name": "John Doe",
    "last_updated": "2024-01-04T10:30:00Z",
    ...
  }
]
```

### GET `/api/park/[code]`
Returns data for a specific park.

**Parameters:**
- `code`: Park code (e.g., MNSHAF)

**Response:**
```json
{
  "park_code": "MNSHAF",
  "park_name": "Shady Acres",
  "park_address": "123 Main St",
  "lot_rent": 450,
  "water_included": 1,
  "trash_included": 1,
  "sewer_included": 0,
  "electric_included": 0,
  "manager_name": "John Doe",
  "manager_phone": "555-0123",
  "manager_address": "456 Oak Ave",
  "community_email": "info@shadyacres.com",
  "office_hours": "Mon-Fri 9AM-5PM",
  "emergency_contact": "555-0911",
  "notes": "Pool closed for maintenance",
  "last_updated": "2024-01-04T10:30:00Z"
}
```

### POST `/api/park/[code]`
Updates or creates park information.

**Request Body:**
```json
{
  "park_name": "Shady Acres",
  "park_address": "123 Main St",
  "lot_rent": 450,
  "water_included": true,
  "trash_included": true,
  "sewer_included": false,
  "electric_included": false,
  "manager_name": "John Doe",
  "manager_phone": "555-0123",
  "manager_address": "456 Oak Ave",
  "community_email": "info@shadyacres.com",
  "office_hours": "Mon-Fri 9AM-5PM",
  "emergency_contact": "555-0911",
  "notes": "Pool closed for maintenance"
}
```

## URL Structure

### Production URLs
- **Dashboard**: `https://your-domain.vercel.app/`
- **Park Forms**: `https://your-domain.vercel.app/form/[PARK_CODE]`
  - Example: `https://your-domain.vercel.app/form/MNSHAF`

### Local Development URLs
- **Dashboard**: `http://localhost:3000/`
- **Park Forms**: `http://localhost:3000/form/[PARK_CODE]`

## Data Fields

Each park record contains:
- **Park Details**
  - Park Name
  - Park Address
  - Lot Rent (monthly)
  
- **Utilities Included**
  - Water (checkbox)
  - Trash (checkbox)
  - Sewer (checkbox)
  - Electric (checkbox)
  
- **Management Information**
  - Manager Name
  - Manager Phone
  - Manager Address
  
- **Contact Information**
  - Community Email
  - Office Hours
  - Emergency Contact
  
- **Additional**
  - Notes/Announcements (text area)
  - Last Updated (timestamp)

## Usage Flow

1. **Park Managers**
   - Receive their unique form link (e.g., `/form/MNSHAF`)
   - Fill out or update park information
   - Submit form to save data

2. **Park Owners/Administrators**
   - Visit dashboard at root URL (`/`)
   - View all parks' information in card layout
   - Click "Edit" links to update specific parks
   - See form links for distribution to managers

3. **Data Persistence**
   - All submissions automatically save to database
   - Updates overwrite previous data for same park code
   - Last updated timestamp tracks changes

## Environment Variables (Production)

When deployed to Vercel, these are automatically configured:
- `KV_URL` - Vercel KV database URL
- `KV_REST_API_URL` - REST API endpoint
- `KV_REST_API_TOKEN` - Authentication token
- `KV_REST_API_READ_ONLY_TOKEN` - Read-only token

## Customization

### Adding New Parks
1. Edit park code arrays in:
   - `/api/parks.js`
   - `/api/park/[code].js`
   - `/dashboard.html` (form links section)

2. Add new park code to `VALID_PARK_CODES` array:
```javascript
const VALID_PARK_CODES = ['MNSHAF', 'MNRFC', 'MNWAT', 'MOGV', 'MOASH', 'MISOL', 'NEWCODE'];
```

### Styling
- Modify inline CSS in `dashboard.html` and `form.html`
- Color scheme uses purple gradient (#667eea to #764ba2)
- Responsive breakpoint at 768px

### Adding Fields
1. Add field to HTML form in `form.html`
2. Update API handler in `/api/park/[code].js`
3. Add field to dashboard display in `dashboard.html`

## Troubleshooting

### Local Development Issues
- **Port already in use**: Kill process on port 3000 or change PORT in server.js
- **Database errors**: Delete `park_data.db` to reset local database

### Vercel Deployment Issues
- **404 errors**: Ensure files are in root directory, not in subdirectories
- **API errors**: Check Vercel KV is properly connected in dashboard
- **Build failures**: Verify all dependencies are in package.json

## Security Considerations
- Park codes are validated against whitelist
- No authentication currently implemented (consider adding for production)
- CORS enabled for API endpoints
- Input sanitization handled by framework

## Future Enhancements
- User authentication and role management
- Park photo uploads
- Historical data tracking
- Email notifications for updates
- PDF report generation
- Advanced search and filtering
- Bulk import/export functionality

## Support
For issues or questions, please open an issue on the [GitHub repository](https://github.com/BuildThingsThatBuildthings/mhpquickinfo/issues).

## License
This project is provided as-is for educational and commercial use.

---
*Built with simplicity and efficiency in mind for rapid deployment and easy maintenance.*