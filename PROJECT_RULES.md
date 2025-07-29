# ED Ribbon Maker - Project Rules

## Project-Specific Conventions

### Elite Dangerous Data Handling
- **Inara API Integration**: All commander data must be fetched from Inara.cz API (https://inara.cz/inapi/v1/)
- **API Key Security**: Never store raw Inara API keys - only store salted hashes
- **Data Synchronization**: Commander profiles should sync automatically every 24 hours via Cloudflare Workers Cron
- **Rate Limiting**: Respect Inara API rate limits (max 10 requests per minute per API key)

### Ribbon Specifications
- **Standard Format**: All ribbons must follow the 32×8.22mm format
- **SVG First**: Ribbons are designed as SVG components for scalability
- **PNG Export**: Generate PNG versions for sharing and storage in R2
- **Career Paths**: Support Combat, Explorer, Trader, Exobiologist, and Mercenary achievements
- **Navy Ranks**: Include Federal Navy (2 designs) and Imperial Navy (2 designs)

### Authentication & User Management
- **Commander Identity**: Users are identified by their Elite Dangerous commander name
- **Inara Verification**: Commander names must be verified against Inara.cz profiles
- **Session Management**: Use JWT tokens with 7-day expiration for user sessions
- **API Key Management**: Users must provide their own Inara API key for data access

### Data Storage Rules
- **User Data**: Store minimal user data - only what's necessary for the application
- **Commander Profiles**: Cache Inara data for 1 hour to reduce API calls
- **Ribbon Images**: Store generated PNG images in Cloudflare R2 with CDN delivery
- **Backup Strategy**: D1 database backups should occur daily

### Performance Requirements
- **Ribbon Generation**: SVG to PNG conversion must complete within 5 seconds
- **API Response**: All API endpoints must respond within 2 seconds
- **Image Loading**: Ribbon images must load within 1 second via CDN
- **Concurrent Users**: Support minimum 100 concurrent users generating ribbons

### Security Requirements
- **HTTPS Only**: All communication must use HTTPS
- **API Key Protection**: Hash API keys with bcrypt (cost factor 12)
- **Input Validation**: All user inputs must be validated with Zod schemas
- **CORS Policy**: Restrict CORS to specific domains only
- **Rate Limiting**: Implement rate limiting on all API endpoints

### UI/UX Standards
- **Responsive Design**: Must work on desktop, tablet, and mobile devices
- **Accessibility**: Follow WCAG 2.1 AA standards for all components
- **Loading States**: Show loading indicators for all async operations
- **Error Handling**: Provide clear error messages for API failures
- **Dark Mode**: Support both light and dark themes

### Development Workflow
- **Type Safety**: All code must be written in TypeScript with strict mode enabled
- **Testing**: Minimum 80% code coverage for all new features
- **Documentation**: All API endpoints must be documented with OpenAPI/Swagger
- **Code Review**: All pull requests require at least one review before merge
- **Deployment**: Use Cloudflare Pages for automatic deployments from main branch

### Elite Dangerous Community Guidelines
- **Respect Copyright**: Ensure all ribbon designs respect Elite Dangerous intellectual property
- **Community Standards**: Follow Elite Dangerous community guidelines for content
- **Attribution**: Credit Frontier Developments appropriately in the application
- **Fair Use**: Use Elite Dangerous assets only for non-commercial purposes

### Data Privacy
- **Minimal Collection**: Only collect data necessary for ribbon generation
- **No Personal Data**: Never store personal information beyond commander names
- **Data Retention**: Delete user data after 30 days of inactivity
- **GDPR Compliance**: Provide data export and deletion capabilities
- **Transparency**: Clearly communicate what data is collected and why

### Error Handling
- **Graceful Degradation**: Application must work even if Inara API is unavailable
- **User Feedback**: Provide clear error messages when API calls fail
- **Retry Logic**: Implement exponential backoff for failed API requests
- **Fallback Data**: Use cached data when fresh data is unavailable

### Monitoring & Analytics
- **Performance Tracking**: Monitor ribbon generation times and API response times
- **Error Tracking**: Log all errors with Sentry for debugging
- **Usage Analytics**: Track ribbon generation counts and popular achievements
- **API Monitoring**: Monitor Inara API response times and error rates

### Future Considerations
- **Frontier OAuth**: Plan for potential Frontier OAuth integration
- **CQC Support**: Prepare for CQC (Close Quarters Combat) ribbon integration
- **Mobile App**: Consider mobile app development for ribbon viewing
- **Social Features**: Plan for ribbon sharing and community features

## Project-Specific File Naming Conventions
- **Ribbon Components**: Use PascalCase with "Ribbon" suffix (e.g., `CombatRibbon.tsx`)
- **API Endpoints**: Use kebab-case for routes (e.g., `/api/commander-profile`)
- **Database Tables**: Use snake_case for table names (e.g., `commander_profiles`)
- **Environment Variables**: Use UPPER_SNAKE_CASE (e.g., `INARA_API_BASE_URL`)

## Project-Specific Code Patterns
- **Commander Data**: Always validate commander names against Inara before processing
- **API Responses**: Use consistent error response format across all endpoints
- **Ribbon Generation**: Implement as stateless functions for better performance
- **Caching Strategy**: Cache Inara responses in KV with 1-hour TTL
- **Image Processing**: Use Sharp for all image manipulation and conversion

## Project-Specific Testing Requirements
- **Inara API Mocking**: Use MSW to mock Inara API responses in tests
- **Ribbon Rendering**: Test SVG generation and PNG export separately
- **API Key Validation**: Test API key hashing and validation thoroughly
- **Concurrent Access**: Test ribbon generation with multiple simultaneous users
- **Error Scenarios**: Test application behavior when Inara API is down

## Project-Specific Documentation Requirements
- **API Documentation**: Document all endpoints with request/response examples
- **Ribbon Design Guide**: Document the 32×8.22mm format and design principles
- **Setup Instructions**: Provide clear instructions for obtaining Inara API keys
- **Troubleshooting**: Document common issues and solutions
- **Community Guidelines**: Document how to create and share ribbon designs