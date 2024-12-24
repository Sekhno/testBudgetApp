import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerbsTesterComponent } from './verbs-tester.component';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { TitleCasePipe } from '@angular/common';
import { VERBS } from './verbs.model';
import { QUESTIONS } from './questions.model';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {StorageService} from './storage/crud';

describe('VerbsTesterComponent', () => {
  let component: VerbsTesterComponent;
  let fixture: ComponentFixture<VerbsTesterComponent>;
  let mockStorageService: jasmine.SpyObj<StorageService>;

  beforeEach(async () => {
    mockStorageService = jasmine.createSpyObj('StorageService', [
      'availableSignal',
      'saveResult',
      'retrieveStatistics'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        FormsModule,
        TitleCasePipe,
        VerbsTesterComponent
      ],
      providers: [
        { provide: StorageService, useValue: mockStorageService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VerbsTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a question and verb', () => {
    expect(component.currentQuestion).not.toBe('');
    expect(component.currentVerb).not.toBeNull();
    expect(component.currentAnswer).toBe('');
    expect(component.totalAnswers.length).toBe(0);
    expect(component.totalRightAnswers).toBe(0);
    expect(component.totalWrongAnswers).toBe(0);
  });

  it('should generate a random verb', () => {
    const verb = component.randomVerb();
    expect(verb).not.toBeNull();
    expect(VERBS.includes(verb!)).toBe(true);
  });

  it('should update currentQuestion and currentVerb in learn()', () => {
    const previousVerb = component.currentVerb;
    component.learn();
    expect(component.currentVerb).not.toEqual(previousVerb);
    expect(component.currentQuestionIndex).toBeGreaterThanOrEqual(0);
    expect(component.currentQuestion).toBe(QUESTIONS[component.currentQuestionIndex]);
  });

  it('should correctly check answer and update scores', () => {
    const verb = VERBS[0]; // Використовуємо перше дієслово
    component.currentVerb = verb;
    component.currentQuestionIndex = 0;
    component.currentAnswer = verb[1][0]; // Правильна відповідь

    component.checkAnswer();

    expect(component.totalRightAnswers).toBe(1);
    expect(component.totalWrongAnswers).toBe(0);
    expect(component.totalAnswers.length).toBe(1);
    expect(component.totalAnswers[0].result).toBe(true);

    // Тест для неправильної відповіді
    component.currentAnswer = 'wrongAnswer';
    component.checkAnswer();

    expect(component.totalRightAnswers).toBe(1);
    expect(component.totalWrongAnswers).toBe(1);
    expect(component.totalAnswers.length).toBe(2);
    expect(component.totalAnswers[1].result).toBe(false);
  });

  it('should throw an error if currentVerb is null in checkAnswer()', () => {
    component.currentVerb = null;
    expect(() => component.checkAnswer()).toThrowError();
  });

  it('should throw an error if no verbs left in randomVerb()', () => {
    while (component.randomVerb()) {
      // Прокручуємо всі дієслова
    }
    expect(component.randomVerb()).toBeNull();
  });
});
