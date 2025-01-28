import { Component, Input } from "@angular/core";

type TSize = 'xl' | 'md' | 'sm' | 'full'

@Component({
    selector: 'skeleton-app',
    templateUrl:'index.component.html',
    styleUrl: 'index.component.scss'
})
export class SkeletonAppComponent {
    @Input({required: true}) size: TSize = 'md'

    getClassSkeleton(): string {
        const classSizes = {
            'xl': 'size-xl',
            'md': 'size-md',
            'sm': 'size-sm',
            'full': 'size-full',
        }

        return classSizes[this.size];
    }
}