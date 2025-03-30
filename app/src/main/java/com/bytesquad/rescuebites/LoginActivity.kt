package com.bytesquad.rescuebites

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bytesquad.rescuebites.databinding.ActivityLoginBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private lateinit var auth: FirebaseAuth

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val justRegistered = intent.getBooleanExtra("justRegistered", false)
        if (justRegistered) {
            Toast.makeText(this, "Registration successful. Please log in.", Toast.LENGTH_LONG).show()
        }


        auth = FirebaseAuth.getInstance()

        binding.loginButton.setOnClickListener {
            val email = binding.emailEditText.text.toString().trim()
            val password = binding.passwordEditText.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            auth.signInWithEmailAndPassword(email, password)
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        Toast.makeText(this, "Welcome!", Toast.LENGTH_SHORT).show()
                        val uid = auth.currentUser?.uid
                        FirebaseFirestore.getInstance().collection("users").document(uid!!)
                            .get()
                            .addOnSuccessListener { document ->
                                val role = document.getString("role")
                                when (role) {
                                    "Donor" -> startActivity(Intent(this, DonorActivity::class.java))
                                    "Beneficiary" -> startActivity(Intent(this, BeneficiaryActivity::class.java))
                                    "Distributor" -> startActivity(Intent(this, DistributorActivity::class.java))
                                    else -> Toast.makeText(this, "Unknown role", Toast.LENGTH_SHORT).show()
                                }
                                finish()
                            }


                    } else {
                        Toast.makeText(this, "Login failed: ${task.exception?.message}", Toast.LENGTH_SHORT).show()
                    }
                }
        }


        binding.registerRedirectText.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }

        binding.forgotPasswordText.setOnClickListener {
            startActivity(Intent(this, ForgotPasswordActivity::class.java))
        }
    }
}
