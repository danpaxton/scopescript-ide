import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight'

// Codemirror theme.
export const myTheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#101010',
    foreground: '#f5f5f5',
    caret: '#ffc107',
    selection: 'rgba(101, 115, 195, 0.33)',
    selectionMatch: 'rgba(101, 115, 195, 0.33)',
    lineHighlight: '#8a91991a',
    gutterBackground: '#101010',
    gutterForeground: '#616161',
  },
  styles: [
       { tag: t.controlKeyword, color: '#ef6c00'},
       { tag: t.namespace, color: '#f5f5f5' },
       { tag: t.variableName, color: '#f5f5f5' },
       { tag: t.special(t.variableName), color: '#8c9eff' },
       { tag: t.propertyName, color: '#ffab40' }, 
       { tag: t.bool, color: '#8c9eff' },
       { tag: t.string, color: '#8bc34a'},
       { tag: t.number, color: '#8c9eff' },
       { tag: t.null, color: '#8c9eff' },
       { tag: t.updateOperator, color: '#ff9800' },
       { tag: t.arithmeticOperator, color: '#ff9800' },
       { tag: t.logicOperator, color: '#ff9800' },
       { tag: t.bitwiseOperator, color: '#ff9800' },
       { tag: t.compareOperator, color: '#ff9800' },
       { tag: t.lineComment, color:'#616161' },
       { tag: t.definitionOperator, color: '#ff9800' },
       { tag: t.function(t.punctuation), color: '#ff9800' },
       { tag: t.paren, color: '#f5f5f5' },
       { tag: t.brace, color: '#f5f5f5' },
       { tag: t.squareBracket, color: '#f5f5f5' },
       { tag: t.derefOperator, color: '#ff9800' },
       { tag: t.separator, color: '#f5f5f5' },
  ],
});
