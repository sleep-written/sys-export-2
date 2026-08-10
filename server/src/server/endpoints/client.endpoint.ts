import { resolve } from 'node:path';
import { Router } from 'express';
import { stat } from 'node:fs/promises';

const baseDir = resolve(
    import.meta.dirname,
    '../../../..',
    'client/dist/client/browser'
);

const exists = async (path: string) => {
    try {
        const stats = await stat(path);
        return stats.isFile();
    } catch {
        return false;
    }
};

export const clientEndpoint = Router().get('{*any}', async (req, res) => {
    const resolvedPath = resolve(baseDir, req.path.slice(1));
    const targetPath = await exists(resolvedPath)
    ?   resolvedPath
    :   resolve(baseDir, 'index.html');

    res.sendFile(targetPath);
});