package com.bytesquad.rescuebites

data class FoodItem(
    val id: String = "",
    val type: String = "",
    val quantity: Int = 0,
    val expiryDate: String = "",
    val pickupLocation: String = "",
    val donorId: String = "",
    val timeStamp: String = ""
)

