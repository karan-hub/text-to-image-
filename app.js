const apiKey = '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'; // Your Hugging Face API key
const model = 'black-forest-labs/FLUX.1-schnell'; // The model you want to use

async function generateImages() {
    const prompt = document.getElementById('prompt').value;
    const numImages = parseInt(document.getElementById('num-images').value, 10);

    if (!prompt || numImages < 1 || numImages > 10) {
        alert('Please provide a valid prompt and number of images.');
        return;
    }

    const imagesContainer = document.getElementById('images-container');
    const loadingSpinner = document.getElementById('loading-spinner'); // Assuming you have this element in your HTML

    if (!imagesContainer || !loadingSpinner) {
        console.error('Required elements are missing in the DOM.');
        return;
    }

    // Show loading spinner
    loadingSpinner.classList.remove('hidden'); // Assuming your loader has a class 'hidden' for hiding

    imagesContainer.innerHTML = ''; // Clear previous images

    const requests = [];

    for (let i = 0; i < numImages; i++) {
        requests.push(fetchImage(prompt));
    }

    try {
        const images = await Promise.all(requests);
        images.forEach(imgSrc => {
            const imgWrapper = document.createElement('div');
            imgWrapper.classList.add('relative', 'max-w-xs', 'max-h-64');

            const img = document.createElement('img');
            img.src = imgSrc;
            img.classList.add('object-cover', 'rounded-md', 'shadow-md', 'w-full', 'h-full');

            const downloadBtn = document.createElement('a');
            downloadBtn.href = imgSrc;
            downloadBtn.download = 'image.png'; // Specify default filename
            downloadBtn.textContent = 'Download';
            downloadBtn.classList.add('mt-2', 'block', 'bg-blue-500', 'text-white', 'px-3', 'py-1', 'rounded-md', 'text-center', 'hover:bg-blue-600', 'transition', 'duration-300');

            imgWrapper.appendChild(img);
            imgWrapper.appendChild(downloadBtn);
            imagesContainer.appendChild(imgWrapper);
        });
    } catch (error) {
        console.error('Error generating images:', error);
        alert('Failed to generate images. Please try again.');
    } finally {
        // Hide loading spinner
        loadingSpinner.classList.add('hidden');
    }
}

async function fetchImage(prompt) {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch image');
    }

    const result = await response.blob();
    return URL.createObjectURL(result);
}


// Example GSAP animations (assuming you have these elements in your HTML)
gsap.from("#navLogo", {
    duration: 1.5,
    opacity: 0,
    y: -50,
    ease: "power3.out"
});

gsap.from("#navHome, #navAbout, #navServices, #navContact", {
    duration: 1.5,
    opacity: 0,
    y: 30,
    stagger: 0.2,
    ease: "power3.out"
});

gsap.from("nav", {
    duration: 1,
    y: -100,
    ease: "bounce.out"
});
