import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = JSON.parse(localStorage.getItem("auth"));

    if (!auth?.userId) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/otp-verify", {
        userId: auth.userId,
        otp: otp.toString(),
      });

      const accessToken = res.data.data;

      toast.success("OTP Verified Successfully");

      localStorage.setItem(
        "auth",
        JSON.stringify({
          ...auth,
          token: accessToken,
          isVerified: true,
        })
      );

      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button type="submit">Verify</button>
    </form>
  );
}
