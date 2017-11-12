import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { WalletsService } from '../services/wallets.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { ToastComponent } from '../shared/toast/toast.component';


@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss']
})
export class WalletsComponent implements OnInit {
  user;
  isLoading = true;
  transactions = [];
  balance = 0;
  newTransactionForm: FormGroup;
  address = new FormControl('', Validators.required);
  value = new FormControl('', Validators.required);
  key = new FormControl('', Validators.required);

    constructor(
      private auth: AuthService,
      private walletsService: WalletsService,
        private formBuilder: FormBuilder,
        public toast: ToastComponent,
        private userService: UserService) { }

ngOnInit() {
  this.getUser();
  this.getTransactions();
  this.newTransactionForm = this.formBuilder.group({
    address: this.address,
    value: this.value,
    key: this.key
  });
}

getUser() {
  this.userService.getUser(this.auth.currentUser).subscribe(
    data => this.user = data,
    error => console.log(error),
    () => {this.isLoading = false;
      this.getBalance(this.user.address); }
  );
}
newTransaction() {
  const transaction = this.newTransactionForm.value;
  transaction.source = this.user.address;
  this.walletsService.newTransaction( transaction).subscribe(
    res => {
      const newTransaction = res.json();
      this.transactions.push(newTransaction);
      this.newTransactionForm.reset();
      this.toast.setMessage('item added successfully.', 'success');
    },
    error => console.log(error)
  );
}

getTransactions() {
  this.walletsService.getTransactions().subscribe(
    data => this.transactions = data,
    error => console.log(error),
    () => this.isLoading = false
  );
}

getBalance(address) {
  this.userService.getBalance(address).subscribe(
    data => this.balance = data,
    error => console.log(error),
    () => this.isLoading = false
  );
}
}
