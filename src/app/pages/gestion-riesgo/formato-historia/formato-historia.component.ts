import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { VariablesHightCostServiceService } from './variables-hight-cost-service.service';

@Component({
  selector: 'app-formato-historia',
  templateUrl: './formato-historia.component.html',
  styleUrls: ['./formato-historia.component.scss'],
})

export class FormatoHistoriaComponent implements OnInit {

  forma: FormGroup;
  constructor(private fb: FormBuilder, private _sendVariablesHightCostService: VariablesHightCostServiceService) { }
  operatorsSelect = ['equal', 'not equal'];
  operators = [
    'is equeal to',
    'is not equal to',
    'begins with',
    '<',
    '>',
    '<=',
    '>=',
  ];
  typeInputs = ['text', 'date', 'check', 'select', 'number', 'textarea'];

  id = 0;
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {

    this.forma = this.fb.group({
      questions: this.fb.array([this.makeCuestion()]),
    });

  }

  makeCuestion() {
    this.id += 1;
    let id = this.id;
    let gb = this.fb.group({
      id,
      title: '¿hello?',
      type: 'text',
      options: this.fb.array([this.fb.group({ value: '' })]),
      validations: this.fb.array([this.makeRules()]),
    });
    let options = gb.get('options') as FormArray
    gb.get('type').valueChanges.subscribe((r) => {
      if (r != 'select' && r != 'check') {
        let opt = options.at(0)
        options.clear()
        options.push(opt)
      }
    });

    return gb;
  }

  get questions() {
    return this.forma.get('questions') as FormArray;
  }
  addQuestion() {
    this.questions.push(this.makeCuestion());
  }

  addRule(condition: FormArray) {
    condition.push(this.makeCondition());
  }

  makeCondition() {
    let g = this.fb.group({
      logic: 'and',
      operator: 'equal',
      value: '',
      id_question_selected: '',
      question_selected: '',
    });


    g.get('id_question_selected').valueChanges.subscribe((r) => {
      const questions = this.forma.get('questions') as FormArray;
      const question = questions.controls.find(
        (x: any) => x.controls.id.value == r
      );

      console.log(question.value);
      g.patchValue({
        question_selected: question.value,
      });
      console.log(g);
    });
    return g;
  }

  addOption(options: FormArray) {
    options.push(this.fb.group({ value: '' }));
  }


  addRu(questionCondition: FormArray) {
    let g = this.fb.group({
      logic: 'and',
      level2: this.fb.array([this.makeCondition()]),
    });
    questionCondition.push(g);
  }


  delete(col: FormArray, pos) {
    col.removeAt(pos);
  }

  makeRules() {
    return this.fb.group({
      rules: this.fb.array([
        this.fb.group({
          logic: 'and',
          level2: this.fb.array([this.makeCondition()]),
        }),
      ]),
      then: '',
    });
  }

  addValidation(validations: FormArray) {
    validations.push(this.makeRules());
  }

  save = () => {
    this._sendVariablesHightCostService.store(this.forma.value).subscribe((arg) => console.log(arg));
  }
}
