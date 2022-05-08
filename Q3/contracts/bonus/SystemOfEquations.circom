pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
include "MultiplierN.circom"; // hint: you can use more than one templates in circomlib-matrix to help you

template matElemMul (m) {
    signal input a[m];
    signal input b[m];
    signal output out[m];
    for (var i=0; i < m; i++) {
        out[i] <== a[i] * b[i];
    }
}

template Sum2(){
   //Declaration of signals.
   signal input in1;
   signal input in2;
   signal output out;

   //Statements.
   out <== in1 + in2;
}

template MatElemSum (N) {
    //Declaration of signals.
   signal input in[N];
   signal output out;
   component comp[N-1];

   //Statements.
   for(var i = 0; i < N-1; i++){
       comp[i] = Sum2();
   }
   comp[0].in1 <== in[0];
   comp[0].in2 <== in[1];
   for(var i = 0; i < N-2; i++){
       comp[i+1].in1 <== comp[i].out;
       comp[i+1].in2 <== in[i+2];

   }
   out <== comp[N-2].out; 
}

template SystemOfEquations(n) { // n is the number of variables in the system of equations
    signal input x[n]; // this is the solution to the system of equations
    signal input A[n][n]; // this is the coefficient matrix
    signal input b[n]; // this are the constants in the system of equations
    signal output out; // 1 for correct solution, 0 for incorrect solution

    component isEqual[n];
    component matElemMul[n];
    component matElemSum[n];
    component multiplierN = MultiplierN(n);

    // [bonus] insert your code here
    for (var i=0; i<n; i++) {
        var currentSum = 0;
        matElemMul[i] = matElemMul(n);
        
        for(var j=0; j<n; j++){
            matElemMul[i].a[j] <== x[j];
            matElemMul[i].b[j] <== A[i][j];
        }
        matElemSum[i] = MatElemSum(n);
        for(var j=0; j<n; j++){
            matElemSum[i].in[j] <== matElemMul[i].out[j];
        }
        isEqual[i] = IsEqual();
        isEqual[i].in[0] <== matElemSum[i].out;
        isEqual[i].in[1] <== b[i];

        multiplierN.in[i] <== isEqual[i].out;
    }

    out <== multiplierN.out;

}

component main {public [A, b]} = SystemOfEquations(3);