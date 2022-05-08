pragma circom 2.0.0;

// [assignment] Modify the circuit below to perform a multiplication of three signals

template Multiplier2(){
     /*Code from the previous example.*/
   signal input left;
   signal input right;
   signal output out;
   out <== left * right;
}

template Multiplier3 () {  

   // Declaration of signals.  
   signal input a;  
   signal input b;
   signal input c;
   signal output d;  

   component mult1 = Multiplier2();
   component mult2 = Multiplier2();

   mult1.left <== a;
   mult1.right <== b;
   mult2.left <== mult1.out;
   mult2.right <== c;
   // Constraints.  
   d <== mult2.out;  
}

component main = Multiplier3();