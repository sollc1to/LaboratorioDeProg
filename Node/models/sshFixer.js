/**
 * MÓDULO SIMPLE PARA FORMATEAR CLAVES SSH
 * Para claves generadas con generateKeyPairSync en formato PKCS1 PEM
 */

class SSHKeyFixer {
    
    /**
     * Formatea una clave privada para ssh2 - VERSIÓN SIMPLE
     * @param {string} privateKey - Clave privada de la base de datos
     * @returns {string} - Clave formateada correctamente
     */
    static fixPrivateKey(privateKey) {
        // Si la clave ya está bien formateada, devolverla tal cual
        if (privateKey.includes('-----BEGIN RSA PRIVATE KEY-----') && 
            privateKey.includes('-----END RSA PRIVATE KEY-----') &&
            privateKey.includes('\n')) {
            return privateKey;
        }
        
        // Caso 1: Reemplazar \n literales por saltos de línea reales
        let fixedKey = privateKey.replace(/\\n/g, '\n');
        
        // Caso 2: Si no tiene headers, agregarlos
        if (!fixedKey.includes('BEGIN RSA PRIVATE KEY')) {
            fixedKey = `-----BEGIN RSA PRIVATE KEY-----\n${fixedKey}\n-----END RSA PRIVATE KEY-----\n`;
        }
        
        // Asegurar que termina con salto de línea
        if (!fixedKey.endsWith('\n')) {
            fixedKey += '\n';
        }
        
        return fixedKey;
    }
    
    /**
     * Verificación rápida de la clave
     */
    static quickCheck(privateKey) {
        const hasBegin = privateKey.includes('BEGIN RSA PRIVATE KEY');
        const hasEnd = privateKey.includes('END RSA PRIVATE KEY');
        const hasNewlines = privateKey.includes('\n');
        const hasEscapedNewlines = privateKey.includes('\\n');
        
        return {
            hasBegin,
            hasEnd, 
            hasNewlines,
            hasEscapedNewlines,
            isValid: hasBegin && hasEnd && hasNewlines && !hasEscapedNewlines
        };
    }
}

module.exports = SSHKeyFixer;