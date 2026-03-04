# React-PDF Professional Reference Document

## 📦 Installation
```bash
npm install @react-pdf/renderer
```

## 🏗️ Core Components with Style Examples

### 1. **Document** - Root wrapper
```tsx
import { Document } from '@react-pdf/renderer';

<Document
  title="My Document"
  author="John Doe"
  subject="Professional Document"
  keywords="pdf, react"
  creator="React-PDF"
  producer="react-pdf"
  pdfVersion="1.7"
  language="en-US"
  pageLayout="oneColumn"
  pageMode="useNone"
>
  <Page>...</Page>
</Document>
```

**pageLayout Options:** `singlePage`, `oneColumn`, `twoColumnLeft`, `twoColumnRight`, `twoPageLeft`, `twoPageRight`
**pageMode Options:** `useNone`, `useOutlines`, `useThumbs`, `fullScreen`, `useOC`, `useAttachments`

### 2. **Page** - Individual pages
```tsx
import { Page } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  }
});

<Page
  size="A4"
  orientation="portrait"
  wrap={true}
  style={styles.page}
>
  {/* Content */}
</Page>
```

### 3. **View** - Layout container
```tsx
import { View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
  }
});

<View style={styles.container}>
  <Text>Left</Text>
  <Text>Center</Text>
  <Text>Right</Text>
</View>
```

### 4. **Text** - Text content
```tsx
import { Text } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    color: '#2563eb',
    marginBottom: 4,
  },
  body: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.5,
  },
  small: {
    fontSize: 8,
    color: '#64748b',
  }
});

<View>
  <Text style={styles.heading}>John Doe</Text>
  <Text style={styles.subheading}>Software Engineer</Text>
  <Text style={styles.body}>Experienced developer with 8+ years...</Text>
  <Text style={styles.small}>San Francisco, CA</Text>
</View>
```

### 5. **Image** - Display images
```tsx
import { Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#2563eb',
  },
  logo: {
    width: 50,
    height: 50,
    objectFit: 'contain',
  }
});

<Image 
  src="https://example.com/profile.jpg" 
  style={styles.profileImage}
  cache={true}
/>
```

### 6. **Link** - Hyperlinks
```tsx
import { Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  link: {
    color: '#2563eb',
    textDecoration: 'underline',
    fontSize: 10,
    marginTop: 4,
  }
});

<Link src="https://linkedin.com/in/johndoe" style={styles.link}>
  View LinkedIn Profile
</Link>
```

### 7. **Note** - Document annotations
```tsx
import { Note } from '@react-pdf/renderer';

<Note>This is a note visible in some PDF readers</Note>
```

### 8. **Canvas** - Custom drawing
```tsx
import { Canvas } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  canvas: {
    width: '100%',
    height: 20,
    marginVertical: 10,
  }
});

<Canvas
  style={styles.canvas}
  paint={(painter, width) => {
    // Draw progress bar
    painter
      .fillColor('#e2e8f0')
      .rect(0, 0, width, 20)
      .fill();
    
    painter
      .fillColor('#2563eb')
      .rect(0, 0, width * 0.7, 20)
      .fill();
  }}
/>
```

### 9. **PDFViewer** - Web preview
```tsx
import { PDFViewer } from '@react-pdf/renderer';

<PDFViewer style={{ width: '100%', height: '100vh' }} showToolbar={true}>
  <MyDocument />
</PDFViewer>
```

### 10. **PDFDownloadLink** - Download button
```tsx
import { PDFDownloadLink } from '@react-pdf/renderer';

<PDFDownloadLink
  document={<MyDocument />}
  fileName="resume.pdf"
  style={{ padding: 10, backgroundColor: '#2563eb', color: 'white' }}
>
  {({ loading }) => loading ? 'Generating...' : 'Download PDF'}
</PDFDownloadLink>
```

## 🎨 Styling System with Examples

### StyleSheet Creation
```tsx
import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  // Layout Example
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
  },
  
  // Typography Example
  name: {
    fontFamily: 'Helvetica',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    lineHeight: 1.2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  // Two Column Layout Example
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  leftCol: {
    width: '30%',
    backgroundColor: '#f8fafc',
    padding: 10,
  },
  rightCol: {
    width: '70%',
    padding: 10,
  },
  
  // Border Examples
  solidBorder: {
    borderWidth: 2,
    borderColor: '#2563eb',
    borderStyle: 'solid',
    padding: 8,
  },
  dashedBorder: {
    borderWidth: 1,
    borderColor: '#dc2626',
    borderStyle: 'dashed',
    padding: 8,
  },
  roundedBox: {
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    padding: 12,
  },
  
  // List Example
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bullet: {
    width: 15,
    fontSize: 10,
    color: '#2563eb',
  },
  bulletText: {
    fontSize: 10,
    color: '#334155',
    flex: 1,
  },
});
```

## 📐 Supported Units with Examples

```tsx
// Examples
width: 200,              // 200 points
height: '100pt',         // 100 points
margin: '0.5in',         // 0.5 inches
padding: '10mm',         // 10 millimeters
fontSize: '12pt',        // 12 points
width: '50%',            // 50% of parent
height: '30vh',          // 30% of page height
```

## 🎯 Complete Style Properties with Examples

### Layout Properties Example
```tsx
const styles = StyleSheet.create({
  flexExample: {
    // Flexbox
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 'auto',
    
    // Alignment
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'flex-start',
    
    // Gaps
    gap: 10,
    rowGap: 5,
    columnGap: 15,
    
    // Positioning
    position: 'relative',
    top: 10,
    left: 20,
  }
});
```

### Typography Properties Example
```tsx
const styles = StyleSheet.create({
  textExample: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#0f172a',
    lineHeight: 1.5,
    letterSpacing: 0.5,
    textAlign: 'center',
    textTransform: 'uppercase',
    textDecoration: 'underline',
  }
});
```

### Border Properties Example
```tsx
const styles = StyleSheet.create({
  borderExample: {
    // All borders
    borderWidth: 1,
    borderColor: '#2563eb',
    borderStyle: 'solid',
    
    // Individual sides
    borderTopWidth: 2,
    borderTopColor: '#dc2626',
    borderTopStyle: 'dashed',
    
    // Border radius
    borderRadius: 4,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
  }
});
```

### Margin & Padding Example
```tsx
const styles = StyleSheet.create({
  spacingExample: {
    // All sides
    margin: 10,
    padding: 15,
    
    // Individual sides
    marginTop: 5,
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    
    // Shortcuts
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 25,
    paddingVertical: 12,
  }
});
```

## 📋 Complete Layout Examples

### Two Column Resume Layout
```tsx
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  columns: { flexDirection: 'row', gap: 15 },
  leftCol: { width: '30%', backgroundColor: '#f8fafc', padding: 15 },
  rightCol: { width: '70%', padding: 15 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  title: { fontSize: 12, color: '#2563eb', marginBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', marginBottom: 8, textTransform: 'uppercase' },
  bulletRow: { flexDirection: 'row', marginBottom: 3 },
  bullet: { width: 12, fontSize: 9 },
  bulletText: { fontSize: 9, flex: 1 },
});

const Resume = () => (
  <Page size="A4" style={styles.page}>
    <View style={styles.columns}>
      {/* Left Column */}
      <View style={styles.leftCol}>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.title}>Software Engineer</Text>
      </View>
      
      {/* Right Column */}
      <View style={styles.rightCol}>
        <Text style={styles.sectionTitle}>Experience</Text>
        <View style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>Led development team</Text>
        </View>
      </View>
    </View>
  </Page>
);
```

### Header with Two Columns
```tsx
const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { 
    marginBottom: 20, 
    borderBottomWidth: 2, 
    borderBottomColor: '#2563eb', 
    paddingBottom: 10 
  },
  headerName: { fontSize: 28, fontWeight: 'bold' },
  headerTitle: { fontSize: 14, color: '#64748b' },
  columns: { flexDirection: 'row', gap: 20 },
  leftCol: { width: '30%' },
  rightCol: { width: '70%' },
});

const Layout = () => (
  <Page size="A4" style={styles.page}>
    {/* Full width header */}
    <View style={styles.header}>
      <Text style={styles.headerName}>John Doe</Text>
      <Text style={styles.headerTitle}>Senior Developer</Text>
    </View>
    
    {/* Two columns below */}
    <View style={styles.columns}>
      <View style={styles.leftCol}>
        <Text>Sidebar content</Text>
      </View>
      <View style={styles.rightCol}>
        <Text>Main content</Text>
      </View>
    </View>
  </Page>
);
```

## 🔑 Key Concepts with Examples

### Page Wrapping Example
```tsx
// Content automatically flows to next page
<Page wrap={true}>
  <View>
    <Text>Page 1 content starts here</Text>
    {Array(50).fill(0).map((_, i) => (
      <Text key={i}>Line {i} - continues to page 2 when full</Text>
    ))}
  </View>
</Page>
// Page 2 is auto-created with remaining content
```

### Fixed Elements Example
```tsx
<Page>
  {/* Header repeats on every page */}
  <View fixed={true} style={{ padding: 10, backgroundColor: '#f8fafc' }}>
    <Text>Company Name - Confidential</Text>
  </View>
  
  {/* Content flows across pages */}
  <View>
    {longContent}
  </View>
  
  {/* Footer repeats on every page */}
  <View fixed={true} style={{ padding: 5, textAlign: 'center' }}>
    <Text render={({ pageNumber, totalPages }) => 
      `Page ${pageNumber} of ${totalPages}`
    }/>
  </View>
</Page>
```

## 🚀 Complete Working Example

```tsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#2563eb', marginVertical: 8 },
  text: { fontSize: 11, color: '#334155', lineHeight: 1.5 },
});

const MyDocument = () => (
  <Document title="My First PDF">
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Hello World</Text>
      <Text style={styles.subtitle}>Created with React-PDF</Text>
      <Text style={styles.text}>
        This is a sample PDF document showing basic styling.
      </Text>
    </Page>
  </Document>
);

export default () => (
  <PDFViewer style={{ width: '100vw', height: '100vh' }}>
    <MyDocument />
  </PDFViewer>
);
```