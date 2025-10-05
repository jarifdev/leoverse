# Public Assets

## Video Files
Video files are located in the `/animations/` folder at the root of the project.

The registration transition video (`1.mp4`) should be in:
`leoverse-frontend/animations/1.mp4`

## How it works
1. User completes registration on `/signup` page
2. Video (`/animations/1.mp4`) plays fullscreen
3. After video ends (or user clicks "Skip"), redirects to country selection
4. Login does NOT show the video - only new registrations

The video is referenced as `/animations/1.mp4` in the VideoTransition component.
