import {Component, inject, OnInit, signal} from '@angular/core';
import {VerbModel, VERBS} from './verbs.model'
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {QUESTIONS} from './questions.model';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {TitleCasePipe} from '@angular/common';
import {MatSnackBar, MatSnackBarConfig, MatSnackBarModule} from '@angular/material/snack-bar';
import {CdkTrapFocus} from '@angular/cdk/a11y';

@Component({
  selector: 'app-verbs-tester',
  standalone: true,
  templateUrl: './verbs-tester.component.html',
  styleUrl: './verbs-tester.component.scss',
  imports: [
    MatButtonModule, MatCardModule, MatInputModule, MatInputModule, MatIcon, MatSnackBarModule, FormsModule,
    TitleCasePipe, CdkTrapFocus
  ],
})
export class VerbsTesterComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);

  public currentQuestionIndex = -1;
  public currentQuestion = '';
  public currentVerb: VerbModel | null = null;
  public currentAnswer = '';
  public totalAnswers: {result: boolean, verb: VerbModel, yourAnswer: string, question: number}[] = [];
  public totalRightAnswers = 0;
  public totalWrongAnswers = 0;
  public completed = signal(false);

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
    this._snackBar.open(message, action,{ duration: 4000, verticalPosition: 'top' });
  }

  public learn()
  {
    const curVerb = this.randomVerb();

    if (curVerb === null) {
      this.completed.set(true);
      return this._openSnackBar('The end', 'CONGRATULATIONS!');
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
    const result = this.currentAnswer === rightAnswer;

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

  ngOnInit(): void
  {
    this.learn();
  }
}