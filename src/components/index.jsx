import React, { useState, useEffect, useRef } from "react"
import "./styles.css"
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons

import {AuthProvider} from "./AuthContext.jsx";

import Task from "./clients/Task.jsx";





 function Header() {

    const [monthYear, setMonthYear] = useState('');
    const [days, setDays] = useState([]);
    const [calender, setCalender] = useState(false)
    const [prev, setPrev] = useState(new Date());
    const location = useLocation();
    const [email, setEmail] = useState(""); // Email state
    const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");

    if (email) {
      setEmail(email);
    }


  }, []);

    const logout = () => {
        // Remove userId and token from localStorage
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("email")
    
        // Navigate the user back to the login page
        navigate("/login");
      };

    const prevButton = document.getElementById("prev")

    useEffect(() => {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
  
      const currentDate = new Date();
      let today = new Date()
  
      function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay()
        const lastDay = new Date(year, month + 1, 0).getDate();

        setMonthYear(`${months[month]} ${year}`);

        //Previous month's dates
        const calendarDaysPrev = [];
        const calendarDays = [];

        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for(let i = firstDay; i > 0; i--) {
            calendarDays.push({
                day: prevMonthLastDay - i + 1,
                isToday: false,
                isPrevDay: true,


            }) 
        }
        setDays(calendarDaysPrev)

        for (let i = 1; i <= lastDay; i++) {
          calendarDays.push({
            day: i,
            isToday: i === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
          });
        }
        setDays(calendarDays);
      }

     
  
      renderCalendar(prev);
    }, [prev]);

    function handlePrevClick() {
        setPrev((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
      }
    
      function handleNextClick() {
        setPrev((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
      }

      function displayProfile() {

      }
  

    return(
        <>
            <header className="Messy">
      <div className="header-content">
        <div className="branding">
          <h1>Your brand</h1>
          {/* <img src={chives} style={{ width: "140px", height: "40px" }} /> */}
        </div>
        <div className='top-nav'>
        <nav className="navbar">
       
          <ul className="nav-links">
            <div className='link-svg'>
            <li><a href="#home">To-do List</a></li></div>
       
            <div onMouseEnter={displayProfile} className='link-svg'>
            <li><a>{email  ? (
        <a>{email}</a>
      ) : (
        <Link to="/login">
        <a>Log in</a></Link>
      )}</a></li></div>
            <div className='link-svg'>
            <li><a href=''>Reminders</a></li></div>
          
            <div className='link-svg'>
            <li><a href="#contact">Contact us & Support</a></li></div>
            <div className="link-svg">
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </div>
          </ul>
         
         
        </nav>
        
        </div>
        
      </div>
      
    </header>
    <div className={`calendar-wrapper ${calender ? 'calendar-wrapper-visible' : 'calendar-wrapper-hidden'}`}>

    {calender && <div className="calender">
                <div className="calender-header">
                    <div onClick={handlePrevClick} id="prev" className="btn"><i><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg></i></div>
                    <div id="month-year">{monthYear}</div>
                    <div onClick={handleNextClick}  id="next" className="btn"><i><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg></i></div>
                </div>
                <div className="weekdays">
                    <div className="weekdays-p">Sun</div>
                    <div className="weekdays-p">Mon</div>
                    <div className="weekdays-p">Tue</div>
                    <div className="weekdays-p">Wed</div>
                    <div className="weekdays-p">Thu</div>
                    <div className="weekdays-p">Fri</div>
                    <div className="weekdays-p">Sat</div>
                </div>
                <div className="days" id="days">
                {days.map((dayObj, index) => (
          <div
            key={index}
            className={`day ${dayObj.isToday ? 'today' : ''} ${dayObj.isPrevDay ? 'fade' : ''}`}
          >
            {dayObj.day}
          </div>
        ))}
                </div>
            </div>}
            </div>
 
        </>
    )
}

function HomePage() {
    return(
        <>
        <Header />
           <div className="main-top">
    <div className="main-header">
    <h1>Rearrange your tasks, stay on track, and crush your goals with ease—let us help you get it all done!</h1>
    
    <div className="register-about">
    <Link to="/signup">
  <button className="register-link">Get Started</button>
</Link>

    <button className="register-link2">Learn More</button>

    </div>
    
</div>
</div>
        </>
    )
}

 function Signup() {

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [status, setStatus] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State to control password visibility
    const navigate = useNavigate(); // Hook for navigation


    function handleChange(event) {
        event.preventDefault();
        setForm(prev => {
            const { value, name } = event.target;
            return {
                ...prev,
                [name]: value,
            };
        });
        console.log(form);
    }

    function handleSubmit(event) {
        event.preventDefault();
        // Navigate to PasswordForm page with the email as a parameter
        navigate('/signup-password', { state: { email: form.email } });
    }
    const onSuccess = (res) => {
        console.log("Login Success! Current user: ", res.profileObj);
    };

    const onFailure = (res) => {
        console.log("Login Failed! res: ", res);
    };

    return (
        <>
        <Header />
            <div className="login-form">
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-container">
                        <input
                            type="text"
                            name="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                   
        <button type="submit">Continue</button>
    </form>
  
    <div className="signup-text">
    <p className="create-para">
By creating an account, you are agreeing to our Terms of Service and acknowledging receipt of our Privacy Policy.
</p>
    <p>
    Already have an account? <Link to="/login">
    <span class="blue-text">login here</span></Link>
</p>

</div>
  
</div>
        </>
    )
}

function Login() {

    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [status, setStatus] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State to control password visibility
    const navigate = useNavigate(); // Hook for navigation
    const [errorMessage, setErrorMessage] = useState(''); // To store error messages
    const location = useLocation(); // Access the location object

    const { imageUrl } = location.state || {}; // Get imageUrl from state

    const [displaimage, setDisplayImg] = useState("")

    function handleImg() {
        setDisplayImg(imageUrl)
    }

    function handleChange(event) {
        event.preventDefault();
        setForm(prev => {
            const { value, name } = event.target;
            return {
                ...prev,
                [name]: value,
            };
        });
        console.log(form);
    }

 const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // Send to your backend
      const result = await axios.post('http://localhost:5000/login', {
        email: form.email,
        password: form.password,
      });

      const { userId, token, email, image } = result.data;

      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      localStorage.setItem('image', image);

      navigate('/Task', {
        state: {
          userId,
          email,
          token,
          image,
        }
      });
    } catch (error) {
      console.error(error);
      if (error.response?.status === 400 || error.response?.status === 404) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage('Login failed. Please check credentials.');
      }
    }
  };

    
 

    const onSuccess = (res) => {
        console.log("Login Success! Current user: ", res.profileObj);
    };

    const onFailure = (res) => {
        console.log("Login Failed! res: ", res);
    };

    return (
        <>
        <Header />

            <div className="login-form">
            
             
           
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-container">
                        <input
                            type="text"
                            name="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-container">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="error-message">
                {errorMessage && <p className="create-para2">{errorMessage}</p>}
                </div>
                   
        <button type="submit">Continue</button>
    </form>
   
    <div className="signup-text">
    <p className="create-para">
By creating an account, you are agreeing to our Terms of Service and acknowledging receipt of our Privacy Policy.
</p>
    <p>
    Don't have an account?   <Link to="/signup">
    <span class="blue-text">signup here</span></Link>
</p>

</div>


</div>
        </>
    )
}

function PasswordForm() {
    const location = useLocation(); // Access the state passed via navigate
    const email = location.state?.email || form.email || '';
    const [form, setForm] = useState({
        email: email, 
        password: '',
    });
    const [status, setStatus] = useState("");
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState(''); // To store error messages
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [preventlogin, setPreventLogin] = useState(false); // Initially set preventlogin to false
    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    const validate = () => {
        const emailField = emailRef.current;
        const passwordField = passwordRef.current;
        console.log('Password length:', passwordField.value.length);  // Check the length in console

        // Validate email
        if (!emailField.value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
            setErrorMessage("Enter a valid email");
            setPreventLogin(true);
            return; 
        }
    
        // Validate password length
        if (passwordField.value.length < 10) {
            setErrorMessage("Password needs to be more 9 characters");
            setPreventLogin(true);
            return; 
        }
        if (!/[A-Z]/.test(passwordField.value)) {
            setErrorMessage("Password needs at least one uppercase");
            setPreventLogin(true);
            return; 
        }
    
        // If both fields are valid
        setErrorMessage('');
        setPreventLogin(false); // Allow login
    };
    


    function handleChange(event) {
        event.preventDefault();
        const { value, name } = event.target;
    
        setForm(prev => {
            const newForm = {
                ...prev,
                [name]: value,
            };
            
            // Only validate the password after it has been updated
            if (name === "password") {
                setTimeout(() => validate(newForm.password), 0);
            }
    
            return newForm;
        });
    }



    function handleSubmit(event) {
        event.preventDefault();
        if (preventlogin) return; 
    
        axios.post('http://localhost:5000/register', {
            email: form.email,
            password: form.password
        })
        .then(response => {
            console.log('API Response:', response.data); 
            const userImageUrl = response.data.user.image; // Make sure the 'img' field exists
            console.log('Profile Image URL:', userImageUrl); // Log the image URL to check if it's correct
    
            
                console.log('Registration successful');
                setForm({ email: '', password: '' }); 
                navigate('/login', { state: { imageUrl: userImageUrl } });
            
        })
        .catch(error => {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.message); 
            } else {
                setErrorMessage('An error occurred during registration');
            }
        });
    }

    return (
        <>
        <Header />
            <div className="login-form">
                <form onSubmit={handleSubmit} className="form">
                <div className="form-container">
                        <input
                        ref={emailRef}
                            id="email-field"
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={handleChange}
                            spellCheck="false"
                            required
                        />
                    </div>
                    <div className="form-container" style={{ position: 'relative' }}>
                <input
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer'
                    }}
                >
                    {showPassword ? <FaEye color="white" /> : <FaEyeSlash color="white" />}

                </span>
            </div>
            
                <div className="error-message">
                {errorMessage && <p className="create-para2">{errorMessage}</p>}
                </div>
                    <button type="submit">Continue</button>
                </form>
                <div className="signup-text">
    <p className="create-para">
By creating an account, you are agreeing to our Terms of Service and acknowledging receipt of our Privacy Policy.
</p>
</div>

            </div>
        </>
    );
}

export default function Navigation() {
    const location = useLocation();


    return (
        <>
        <div className="top-app">
        <AuthProvider>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/signup-password" element={<PasswordForm />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Task" element={<Task />} />


            </Routes>
            </AuthProvider>
            </div>
        </>
    );
}

