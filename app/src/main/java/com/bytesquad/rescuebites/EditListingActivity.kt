package com.bytesquad.rescuebites

import android.app.Activity
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bytesquad.rescuebites.databinding.ActivityEditListingBinding
import com.google.firebase.firestore.FirebaseFirestore

class EditListingActivity : AppCompatActivity() {

    private lateinit var binding: ActivityEditListingBinding
    private lateinit var listingId: String
    private val db = FirebaseFirestore.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEditListingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        listingId = intent.getStringExtra("id") ?: ""

        if (listingId.isEmpty()) {
            Toast.makeText(this, "Invalid listing ID", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        // Pre-fill form fields
        binding.editFoodName.setText(intent.getStringExtra("type") ?: "")
        binding.editQuantity.setText((intent.getIntExtra("quantity", 0)).toString())
        binding.editExpiryDate.setText(intent.getStringExtra("expiry") ?: "")
        binding.editPickupLocation.setText(intent.getStringExtra("location") ?: "")

        // Update logic
        binding.saveChangesButton.setOnClickListener {
            val updated = hashMapOf<String, Any>(
                "type" to binding.editFoodName.text.toString().trim(),
                "quantity" to (binding.editQuantity.text.toString().toIntOrNull() ?: 0),
                "expiryDate" to binding.editExpiryDate.text.toString().trim(),
                "pickupLocation" to binding.editPickupLocation.text.toString().trim()
            )

            db.collection("foodItems").document(listingId)
                .update(updated)
                .addOnSuccessListener {
                    Toast.makeText(this, "Updated successfully", Toast.LENGTH_SHORT).show()
                    setResult(Activity.RESULT_OK)
                    finish()
                }
                .addOnFailureListener {
                    Toast.makeText(this, "Update failed: ${it.message}", Toast.LENGTH_SHORT).show()
                }
        }

        // Delete logic
        binding.deleteButton.setOnClickListener {
            db.collection("foodItems").document(listingId)
                .delete()
                .addOnSuccessListener {
                    Toast.makeText(this, "Deleted successfully", Toast.LENGTH_SHORT).show()
                    setResult(Activity.RESULT_OK)
                    finish()
                }
                .addOnFailureListener {
                    Toast.makeText(this, "Delete failed: ${it.message}", Toast.LENGTH_SHORT).show()
                }
        }
    }
}
