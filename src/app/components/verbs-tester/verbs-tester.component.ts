import {Component, OnInit} from '@angular/core';
import {VerbModel, VERBS} from './verbs.model'
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {QUESTIONS} from './questions.model';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-verbs-tester',
  standalone: true,
  templateUrl: './verbs-tester.component.html',
  styleUrl: './verbs-tester.component.scss',
  imports: [
    MatButtonModule, MatCardModule, MatInputModule, MatInputModule, MatIcon, FormsModule, TitleCasePipe,
  ],
})
export class VerbsTesterComponent implements OnInit {
  public currentQuestionIndex = -1;
  public currentQuestion = '';
  public currentVerb: VerbModel | null = null;
  public currentAnswer = '';
  public totalAnswers: {result: boolean, verb: VerbModel}[] = [];
  public totalRightAnswers = 0;
  public totalWrongAnswers = 0;

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

  public learn()
  {
    const curVerb = this.randomVerb();

    if (curVerb === null) throw new Error('Not implemented');

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

    const result = this.currentAnswer === this.currentVerb[1][this.currentQuestionIndex];

    if (result) {
      this.totalRightAnswers++;
    } else {
      this.totalWrongAnswers++;
    }

    this.totalAnswers.push({
      result,
      verb: this.currentVerb,
    });

    this.learn();
  }

  ngOnInit(): void
  {
    this.learn();
  }
}
