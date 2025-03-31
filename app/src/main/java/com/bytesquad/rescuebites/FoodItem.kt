package com.bytesquad.rescuebites
import java.util.Date


data class FoodItem(
    val id: String = "",
    val type: String = "",
    val quantity: Int = 0,
    val expiryDate: String = "",
    val pickupLocation: String = "",
    val donorId: String = "",
    val timeStamp: Date? = null,
    val imageUrl: String = ""


)

