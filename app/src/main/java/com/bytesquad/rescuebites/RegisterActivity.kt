package com.bytesquad.rescuebites

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bytesquad.rescuebites.databinding.ActivityRegisterBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class RegisterActivity : AppCompatActivity() {
    private lateinit var binding: ActivityRegisterBinding
    private lateinit var auth: FirebaseAuth

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        auth = FirebaseAuth.getInstance()

        binding.registerButton.setOnClickListener {
            val email = binding.emailEditText.text.toString().trim()
            val password = binding.passwordEditText.text.toString().trim()
            val selectedRole = binding.roleSpinner.selectedItem.toString()

            if (email.isEmpty() || password.length < 6) {
                Toast.makeText(this, "Enter valid email & password (6+ chars)", Toast.LENGTH_SHORT)
                    .show()
                return@setOnClickListener
            }

            auth.createUserWithEmailAndPassword(email, password)
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        val uid = auth.currentUser?.uid
                        val user = hashMapOf(
                            "email" to email,
                            "role" to selectedRole
                        )
                        FirebaseFirestore.getInstance().collection("users").document(uid!!)
                            .set(user)
                            .addOnSuccessListener {
                                Toast.makeText(this, "Registered as $selectedRole!", Toast.LENGTH_SHORT).show()
                                startActivity(
                                    Intent(this, LoginActivity::class.java).apply {
                                        putExtra("justRegistered", true)
                                    }
                                )
                                finish()
                            }
                    } else {
                        Toast.makeText(
                            this,
                            "Error: ${task.exception?.message}",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
        }


            binding.loginRedirectText.setOnClickListener {
                startActivity(
                    Intent(this, LoginActivity::class.java).apply {
                        putExtra("justRegistered", true)
                    }
                )
            }
    }
}
