using FluentValidation;

namespace FSU.SmartMenuWithAI.API.Validations
{
    public class ImageFileValidator : AbstractValidator<IFormFile>
    {
        public ImageFileValidator()
        {
            RuleFor(x => x.ContentType).NotNull().Must(x => x.Equals("image/jpeg") || x.Equals("image/jpg") || x.Equals("image/png"))
                .WithMessage("File type '.jpeg / .jpg / .png' are required");
        }
    }
    public class VideoValidator : AbstractValidator<IFormFile>
    {
        public VideoValidator()
        {
            RuleFor(v => v.ContentType)
            .NotNull()
            .Must(ct => ct.Equals("video/mp4") || ct.Equals("video/avi") || ct.Equals("video/mov"))
            .WithMessage("file type '.mp4 / .avi / .mov.' are required");
        }
    }
}
