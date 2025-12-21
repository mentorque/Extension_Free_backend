// src/Main.jsx
import Entry from './Entry';
import { JobDataProvider } from './context/jobContext';
import { ResumeProvider } from './context/userContext';
import { ThemeProvider } from './context/themeContext.jsx';

const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <ResumeProvider>
        <JobDataProvider>
          {children}
        </JobDataProvider>
      </ResumeProvider>
    </ThemeProvider>
  );
};

const Main = () => {
  return (
    <AppProviders>
      <Entry />
    </AppProviders>
  );
};

export default Main;