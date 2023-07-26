import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  boards: any[] = [];


  ngOnInit(): void {
    // Здесь вызывайте метод сервиса, чтобы получить данные о досках
    // и сохраните их в переменной boards
  }
  goToBoard(boardId: string): void {
    // Здесь реализуйте переход на одну из досок по boardId
  }
}
