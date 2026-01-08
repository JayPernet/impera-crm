"use client";

import { useEffect } from "react";

export function triggerConfetti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Create confetti particles
        createConfettiParticles(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            })
        );
        createConfettiParticles(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            })
        );
    }, 250);
}

function createConfettiParticles(options: any) {
    // Simple confetti implementation using DOM elements
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = String(options.zIndex || 9999);
    document.body.appendChild(container);

    const colors = ['#FFCD00', '#ffffff', '#3D474E', '#192230', '#ffd733'];

    for (let i = 0; i < options.particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = `${options.origin.x * 100}%`;
        particle.style.top = `${options.origin.y * 100}%`;
        particle.style.borderRadius = '50%';
        particle.style.opacity = '1';

        container.appendChild(particle);

        // Animate particle
        const angle = Math.random() * Math.PI * 2;
        const velocity = options.startVelocity + Math.random() * 10;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        let x = parseFloat(particle.style.left);
        let y = parseFloat(particle.style.top);
        let opacity = 1;

        const animation = setInterval(() => {
            x += vx * 0.1;
            y += vy * 0.1 + 0.5; // gravity
            opacity -= 0.02;

            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            particle.style.opacity = String(opacity);

            if (opacity <= 0 || y > 100) {
                clearInterval(animation);
                particle.remove();
            }
        }, 16);
    }

    // Remove container after animation
    setTimeout(() => {
        container.remove();
    }, options.ticks * 16);
}

export function Confetti() {
    return null; // This is a utility component, no UI
}
