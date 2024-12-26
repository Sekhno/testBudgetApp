import {afterRender, Component, effect, Inject, inject, NgZone, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {VerbModel, VERBS} from './verbs.model'
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {QUESTIONS} from './questions.model';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {AsyncPipe, isPlatformBrowser, TitleCasePipe} from '@angular/common';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {StatisticsComponent} from './statistics/statistics.component';
import {StorageService} from './storage/crud';
import {interval} from 'rxjs';

@Component({
  selector: 'app-verbs-tester',
  standalone: true,
  templateUrl: './verbs-tester.component.html',
  styleUrl: './verbs-tester.component.scss',
  imports: [
    MatButtonModule, MatCardModule, MatInputModule, MatInputModule, MatIcon, MatSnackBarModule, MatDialogModule,
    FormsModule, TitleCasePipe, AsyncPipe
  ]
})
export class VerbsTesterComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  private _dialog = inject(MatDialog);
  private _storage = inject(StorageService)

  public currentQuestionIndex = -1;
  public currentQuestion = '';
  public currentVerb: VerbModel | null = null;
  public currentAnswer = '';
  public totalAnswers: {result: boolean, verb: VerbModel, yourAnswer: string, question: number}[] = [];
  public totalRightAnswers = 0;
  public totalWrongAnswers = 0;
  public readonly completed = signal(false);
  // public count = signal(0);

  private VERBS = VERBS;
  private QUESTIONS = QUESTIONS;
  private _getRandomElement = this._createRandomPicker();

  private _createRandomPicker()
  {
    const indices = [...this.VERBS] as VerbModel[];

    if (!indices) throw new Error();

    return function() {
      if (indices.length === 0) {
        return null;
      }

      const randomIndex = Math.floor(Math.random() * indices.length);
      return  indices.splice(randomIndex, 1)[0];
    }
  }

  private _openSnackBar(message: string, action: string = '')
  {
    this._snackBar.open(message, action,{ duration: 4000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: 'snack-bar' });
  }

  public learn()
  {
    const curVerb = this.randomVerb();

    if (curVerb === null) {
      this.completed.set(true);
      return this._openSnackBar('🎉🎉🎉  The end 🎉🎉🎉', 'CONGRATULATIONS!');
    }

    this.currentQuestionIndex = Math.floor(Math.random() * this.QUESTIONS.length)
    this.currentQuestion = this.QUESTIONS[this.currentQuestionIndex];
    this.currentVerb = curVerb;
    this.currentAnswer = '';
  }

  public randomVerb()
  {
    return this._getRandomElement();
  }

  public checkAnswer()
  {
    if (!this.currentVerb) throw new Error();

    const rightAnswer = this.currentVerb[1][this.currentQuestionIndex];
    const result = this.currentAnswer.toLowerCase() === rightAnswer;

    if (result) {
      this.totalRightAnswers++;
    } else {
      this.totalWrongAnswers++;
      this._openSnackBar(`::  ${rightAnswer}  ::`, 'WRONG')
    }

    this.totalAnswers.push({
      result,
      yourAnswer: this.currentAnswer,
      verb: this.currentVerb,
      question: this.currentQuestionIndex
    });

    this.learn();
  }

  public async showStatistics()
  {
    const statistics = await this._storage.retrieveStatistics();
    const dialogRef = this._dialog.open(
      StatisticsComponent,
      {
        data: statistics
      });
  }

  constructor(
    // @Inject(PLATFORM_ID) private platformId: Object,
    // private ngZone: NgZone
  )
  {
    effect(async () => {
      if (this.completed()) {
        await this._storage.saveResult({
          total: this.totalAnswers.length,
          wrong: this.totalWrongAnswers,
          right: this.totalRightAnswers,
          date: new Date().getTime()
        })
      }
    });

    // this.ngZone.runOutsideAngular(() => {
    //   interval(1000).subscribe((v) => {
    //     this.count.set(v)
    //   })
    // });



  }

  ngOnInit(): void
  {
    this.learn();
  }
}
