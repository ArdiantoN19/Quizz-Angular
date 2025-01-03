import { NgOptimizedImage } from "@angular/common";
import { Component, computed, signal, WritableSignal, OnInit, OnDestroy } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

type TTestimoni = {
    name: string;
    job: string;
    rating: number;
    description: string;
    photo: string;
}

const testimonials: TTestimoni[] = [
    {
        name: 'Nina Wolfman',
        description: 'This app is so much fun! I can exercise my brain every day with a variety of exciting categories. I even started playing with my friends to see who can get the highest score! This quiz really makes learning more enjoyable.',
        job: 'Student',
        rating: 5,
        photo: '1.png'
    },
    {
        name: 'Jessica Moner',
        description: 'I never knew quizzes could be this engaging! The leaderboard feature makes me even more motivated to keep playing and improve my score. Every question is challenging and makes me want to learn more.',
        job: 'Content Creator',
        rating: 5,
        photo: '2.png'
    },
    {
        name: 'Sarah Wellber',
        description: "This quiz is not just a game, it's a fun way to learn. Each category gives new insights, and I feel smarter every time I finish playing. It's perfect for anyone who wants to expand their knowledge while having fun!",
        job: 'Product Development',
        rating: 5,
        photo: '3.png'
    },
]

@Component({
    selector: 'testimonial-app',
    templateUrl: 'index.component.html',
    styleUrl: 'index.component.scss',
    imports: [MatCardModule, NgOptimizedImage, MatIconModule]
})
export class TestimonialComponent implements OnInit, OnDestroy {
    private intervalTestimoni: any;
    activeTestimoni:WritableSignal<number> = signal<number>(0);
    testimoni = computed(() => {
        const data = testimonials[this.activeTestimoni()]
        return {
            ...data,
            rating: Array(data.rating).fill(null).map((_, index) => index)
        }
    });
    testimoniLength: number[] = Array(testimonials.length).fill(null).map((_, index) => index);

    ngOnInit(): void {
        this.intervalTestimoni = setInterval(() => {
            this.activeTestimoni.update((val) => (val + 1) % this.testimoniLength.length);
        }, 3000);
    }

    ngOnDestroy(): void {
        clearInterval(this.intervalTestimoni)
    }

    onChangeActiveTestimoni(index: number) {
        this.activeTestimoni.set(index)
    }

}