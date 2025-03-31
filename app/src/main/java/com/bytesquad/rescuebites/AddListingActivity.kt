package com.bytesquad.rescuebites

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bytesquad.rescuebites.databinding.ActivityAddListingBinding
import com.google.firebase.Timestamp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class AddListingActivity : AppCompatActivity() {
    private lateinit var binding: ActivityAddListingBinding
    private lateinit var db: FirebaseFirestore
    private lateinit var auth: FirebaseAuth

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAddListingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        db = FirebaseFirestore.getInstance()
        auth = FirebaseAuth.getInstance()

        // Add Image button placeholder
        binding.addImageButton.setOnClickListener {
            Toast.makeText(this, "Image picker not yet implemented", Toast.LENGTH_SHORT).show()
        }

        binding.submitButton.setOnClickListener {
            val type = binding.foodTypeEditText.text.toString().trim()
            val quantity = binding.quantityEditText.text.toString().toIntOrNull() ?: 0
            val expiry = binding.expiryDateEditText.text.toString().trim()
            val location = binding.pickupLocationEditText.text.toString().trim()
            val uid = auth.currentUser?.uid ?: ""

            if (type.isEmpty() || expiry.isEmpty() || location.isEmpty()) {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val food = hashMapOf(
                "type" to type,
                "quantity" to quantity,
                "expiryDate" to expiry,
                "pickupLocation" to location,
                "donorId" to uid,
                "timeStamp" to Timestamp.now(),
                "imageUrl" to "https://source.unsplash.com/400x200/?food&sig=${(1..1000).random()}"
            )

            db.collection("foodItems").add(food)
                .addOnSuccessListener {
                    Toast.makeText(this, "Listing added!", Toast.LENGTH_SHORT).show()
                    setResult(RESULT_OK)
                    finish()
                }
                .addOnFailureListener {
                    Toast.makeText(this, "Error adding listing", Toast.LENGTH_SHORT).show()
                }
        }
    }
}
