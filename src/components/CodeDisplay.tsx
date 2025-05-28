import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import { Copy, Check } from 'lucide-react';

// Register TypeScript language with the syntax highlighter
SyntaxHighlighter.registerLanguage('typescript', typescript);

interface CodeDisplayProps {
  code: string;
  title: string;
  subtitle: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, title, subtitle }) => {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="mr-1.5 h-4 w-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-4 w-4" />
              Copy
            </>
          )}
        </button>
      </div>
      
      <div className="relative max-h-96 overflow-auto rounded-md shadow-md">
        <SyntaxHighlighter
          language="typescript"
          style={vs2015}
          customStyle={{ margin: 0, borderRadius: '0.375rem', padding: '1rem' }}
          wrapLongLines
        >
          {code}
        </SyntaxHighlighter>
      </div>
      
      <div className="p-2 bg-gray-100 rounded text-xs text-gray-600">
        <span className="font-semibold">💡 Usage:</span> Save this code as a .ts file in your NestJS entities folder.
      </div>
      
      <div className="p-2 bg-gray-100 rounded text-xs text-gray-600">
        <span className="font-semibold">📦 Required packages:</span> @nestjs/typeorm, typeorm, class-validator
      </div>
    </div>
  );
};

export default CodeDisplay;