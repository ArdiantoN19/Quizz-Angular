import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'slug'
})
export class SlugPipe implements PipeTransform {
    transform(value: string, separator: string = '-') {
        return value.toLowerCase().split(' ').join(separator)
    }
}