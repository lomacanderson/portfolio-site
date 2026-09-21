import { useState, useCallback } from 'react';
// @ts-expect-error -- 'brotli' is a CJS package without type declarations
import brotli from 'brotli/decompress';

export function BrotliDecoder() {
    const [hexInput, setHexInput] = useState('');
    const [base64Output, setBase64Output] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const decode = useCallback(async (hex: string) => {
        setError('');
        setOutput('');
        setBase64Output('');

        if (!hex.trim()) return;

        try {
            // Strip whitespace and optional "0x" prefixes
            const cleaned = hex.replace(/\s+/g, '').replace(/0x/gi, '');

            if (!/^[0-9a-fA-F]*$/.test(cleaned)) {
                setError('Invalid hex string');
                return;
            }
            if (cleaned.length % 2 !== 0) {
                setError('Hex string must have an even number of characters');
                return;
            }

            // Hex to Uint8Array
            const bytes = new Uint8Array(
                cleaned.match(/.{2}/g)!.map(b => parseInt(b, 16))
            );

            // Convert to base64 for display
            const base64 = btoa(String.fromCharCode(...bytes));
            setBase64Output(base64);

            // Brotli decompress using pure JS brotli package
            const decompressed = brotli(bytes);

            // Decode as UTF-8 text
            const text = new TextDecoder().decode(decompressed);
            setOutput(text);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            setError(`Decode failed: ${msg}`);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setHexInput(val);
        decode(val);
    };

    return (
        <div style={{ display: 'flex', gap: '1rem', padding: '1rem', minHeight: '80vh' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="hex-input" style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Hex Input
                </label>
                <textarea
                    id="hex-input"
                    value={hexInput}
                    onChange={handleChange}
                    placeholder="Paste hex string here (e.g. 1b0400 ...)"
                    style={{
                        flex: 1,
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        padding: '0.75rem',
                        resize: 'none',
                        border: '1px solid #555',
                        borderRadius: '4px',
                        backgroundColor: '#1e1e1e',
                        color: '#e0e0e0',
                    }}
                />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Base64
                    </label>
                    <pre style={{
                        flex: 1,
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        padding: '0.75rem',
                        border: '1px solid #555',
                        borderRadius: '4px',
                        backgroundColor: '#1e1e1e',
                        color: '#e0e0e0',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        margin: 0,
                        overflow: 'auto',
                    }}>
                        {base64Output}
                    </pre>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 2 }}>
                    <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Brotli Decoded
                    </label>
                    {error ? (
                        <pre style={{
                            flex: 1,
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            padding: '0.75rem',
                            border: '1px solid #a33',
                            borderRadius: '4px',
                            backgroundColor: '#2a1010',
                            color: '#ff6666',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            margin: 0,
                            overflow: 'auto',
                        }}>
                            {error}
                        </pre>
                    ) : (
                        <pre style={{
                            flex: 1,
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            padding: '0.75rem',
                            border: '1px solid #555',
                            borderRadius: '4px',
                            backgroundColor: '#1e1e1e',
                            color: '#e0e0e0',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            margin: 0,
                            overflow: 'auto',
                        }}>
                            {output}
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );
}
