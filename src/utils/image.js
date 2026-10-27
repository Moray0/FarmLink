// Product photos are stored as small JPEG data URLs on the product document,
// so no separate file storage is needed. Firestore documents are limited to
// 1 MB, so photos are resized and compressed in the browser first.
export const MAX_IMAGE_CHARS = 150000;

export async function fileToCompressedDataUrl(file, maxSize = 640) {
    if (!file || !file.type.startsWith('image/')) {
        throw new Error('Please choose an image file.');
    }

    const objectUrl = URL.createObjectURL(file);

    try {
        const image = await new Promise((resolve, reject) => {
            const element = new Image();
            element.onload = () => resolve(element);
            element.onerror = () =>
                reject(new Error('That image could not be read.'));
            element.src = objectUrl;
        });

        const scale = Math.min(
            1,
            maxSize / Math.max(image.width, image.height)
        );

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        let quality = 0.75;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        while (dataUrl.length > MAX_IMAGE_CHARS && quality > 0.3) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        if (dataUrl.length > MAX_IMAGE_CHARS) {
            throw new Error('That image is too large. Try a smaller photo.');
        }

        return dataUrl;
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
}
