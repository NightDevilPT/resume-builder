// style.ts
// Complete Style interface matching @react-pdf/renderer supported properties

export interface Style {
  // Flexbox
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  flex?: number | string;
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  flexFlow?: string;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number | string;
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;

  // Layout
  bottom?: number | string;
  display?: 'flex' | 'none';
  left?: number | string;
  position?: 'absolute' | 'relative';
  right?: number | string;
  top?: number | string;
  overflow?: 'hidden' | 'visible';
  zIndex?: number;

  // Dimensions
  height?: number | string;
  maxHeight?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  minWidth?: number | string;
  width?: number | string;

  // Color & Opacity
  backgroundColor?: string;
  color?: string;
  opacity?: number;

  // Text
  fontSize?: number | string;
  fontFamily?: string;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  fontWeight?: number | 'normal' | 'bold' | 'light' | 'lighter' | 'bolder' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  letterSpacing?: number | string;
  lineHeight?: number | string;
  maxLines?: number;
  textAlign?: 'left' | 'right' | 'center' | 'justify';
  textDecoration?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  textDecorationColor?: string;
  textDecorationStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'wavy';
  textIndent?: number | string;
  textOverflow?: 'clip' | 'ellipsis';
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';

  // Sizing/positioning
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string | number;

  // Margin
  margin?: number | string;
  marginHorizontal?: number | string;
  marginVertical?: number | string;
  marginTop?: number | string;
  marginRight?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;

  // Padding
  padding?: number | string;
  paddingHorizontal?: number | string;
  paddingVertical?: number | string;
  paddingTop?: number | string;
  paddingRight?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;

  // Borders
  border?: number | string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  borderWidth?: number | string;
  borderTop?: number | string;
  borderTopColor?: string;
  borderTopStyle?: 'solid' | 'dashed' | 'dotted';
  borderTopWidth?: number | string;
  borderRight?: number | string;
  borderRightColor?: string;
  borderRightStyle?: 'solid' | 'dashed' | 'dotted';
  borderRightWidth?: number | string;
  borderBottom?: number | string;
  borderBottomColor?: string;
  borderBottomStyle?: 'solid' | 'dashed' | 'dotted';
  borderBottomWidth?: number | string;
  borderLeft?: number | string;
  borderLeftColor?: string;
  borderLeftStyle?: 'solid' | 'dashed' | 'dotted';
  borderLeftWidth?: number | string;
  borderRadius?: number | string;
  borderTopLeftRadius?: number | string;
  borderTopRightRadius?: number | string;
  borderBottomRightRadius?: number | string;
  borderBottomLeftRadius?: number | string;

  // Transformations
  transform?: string;
  transformOrigin?: string;

  // Allow additional custom properties if needed
  [key: string]: any;
}